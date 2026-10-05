/**
 * Upstream Pre-Execution Metering Gatekeeper
 * 
 * Operating Principle:
 * "Upstream Settlement: Zero compute executes without valid pre-flight authentication 
 *  and active ledger verification."
 */

export interface GatekeeperAccount {
  userId: string;
  credits: number;
  subscription?: {
    isActive: boolean;
    subscriptionId?: string;
    renewedAt?: string;
    tier?: string;
  };
}

export interface GatekeeperAuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: "preflight_authorized" | "preflight_deducted" | "preflight_rejected" | "execution_refunded" | "credit_topup" | "subscription_activated";
  amount: number;
  remainingCredits: number;
  details?: Record<string, any>;
}

export class GatekeeperService {
  private accounts = new Map<string, GatekeeperAccount>();
  private auditLog: GatekeeperAuditEntry[] = [];
  private processedEvents = new Set<string>();
  private customerToUser = new Map<string, string>();

  // Default unit execution cost
  public static readonly DEFAULT_EXECUTION_COST = 0.05;

  constructor() {
    // Seed default developer account for testing
    this.accounts.set("admin_agent", {
      userId: "admin_agent",
      credits: 25.00,
      subscription: {
        isActive: true,
        tier: "Enterprise Operator",
        subscriptionId: "sub_apex_enterprise"
      }
    });
    this.accounts.set("demo_user", {
      userId: "demo_user",
      credits: 5.00,
      subscription: {
        isActive: false
      }
    });
  }

  getAccount(userId: string): GatekeeperAccount {
    let account = this.accounts.get(userId);
    if (!account) {
      account = { userId, credits: 0 };
      this.accounts.set(userId, account);
    }
    return account;
  }

  isEventProcessed(eventId: string): boolean {
    return this.processedEvents.has(eventId);
  }

  markEventProcessed(eventId: string): void {
    this.processedEvents.add(eventId);
  }

  linkCustomerToUser(customerId: string, userId: string): void {
    this.customerToUser.set(customerId, userId);
  }

  getUserIdByCustomer(customerId: string): string | undefined {
    return this.customerToUser.get(customerId);
  }

  addCredits(userId: string, amount: number, details?: Record<string, any>): number {
    const account = this.getAccount(userId);
    account.credits = Math.round((account.credits + amount) * 100) / 100;
    
    this.logAudit({
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      userId,
      action: "credit_topup",
      amount,
      remainingCredits: account.credits,
      details
    });

    return account.credits;
  }

  activateSubscription(userId: string, subscriptionId: string, tier = "Pro"): void {
    const account = this.getAccount(userId);
    account.subscription = {
      isActive: true,
      subscriptionId,
      renewedAt: new Date().toISOString(),
      tier
    };

    this.logAudit({
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      userId,
      action: "subscription_activated",
      amount: 0,
      remainingCredits: account.credits,
      details: { subscriptionId, tier }
    });
  }

  /**
   * Upstream Pre-Flight Verification Hook.
   * MUST be called before allocating any compute, dispatching LLM calls, or firing tools.
   */
  async verifyAndSettlePreflight(
    userId: string,
    cost = GatekeeperService.DEFAULT_EXECUTION_COST,
    meta?: Record<string, any>
  ): Promise<{
    allowed: boolean;
    reason?: string;
    settlementType: "subscription" | "metered_credit";
    creditsDeducted: number;
    remainingCredits: number;
    auditId?: string;
  }> {
    const account = this.getAccount(userId);

    // 1. Subscription Override (Active recurring access)
    if (account.subscription?.isActive) {
      const auditId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      this.logAudit({
        id: auditId,
        timestamp: new Date().toISOString(),
        userId,
        action: "preflight_authorized",
        amount: 0,
        remainingCredits: account.credits,
        details: { subscription: account.subscription, ...meta }
      });

      return {
        allowed: true,
        settlementType: "subscription",
        creditsDeducted: 0,
        remainingCredits: account.credits,
        auditId
      };
    }

    // 2. Metered Pay-per-Call: Atomic Deduction Check
    if (account.credits >= cost) {
      account.credits = Math.round((account.credits - cost) * 100) / 100;
      const auditId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      
      this.logAudit({
        id: auditId,
        timestamp: new Date().toISOString(),
        userId,
        action: "preflight_deducted",
        amount: cost,
        remainingCredits: account.credits,
        details: { cost, ...meta }
      });

      return {
        allowed: true,
        settlementType: "metered_credit",
        creditsDeducted: cost,
        remainingCredits: account.credits,
        auditId
      };
    }

    // 3. Insufficient balance -> Reject upfront
    const auditId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    this.logAudit({
      id: auditId,
      timestamp: new Date().toISOString(),
      userId,
      action: "preflight_rejected",
      amount: cost,
      remainingCredits: account.credits,
      details: { required: cost, current: account.credits, ...meta }
    });

    return {
      allowed: false,
      reason: `Insufficient funds. Cost is $${cost.toFixed(2)}, current balance is $${account.credits.toFixed(2)}. Active subscription or positive balance required.`,
      settlementType: "metered_credit",
      creditsDeducted: 0,
      remainingCredits: account.credits,
      auditId
    };
  }

  /**
   * Refund credit if downstream execution failed
   */
  refundExecution(userId: string, amount: number, reason: string): void {
    const account = this.getAccount(userId);
    account.credits = Math.round((account.credits + amount) * 100) / 100;
    
    this.logAudit({
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      userId,
      action: "execution_refunded",
      amount,
      remainingCredits: account.credits,
      details: { reason }
    });
  }

  getAuditTrail(userId?: string, limit = 50): GatekeeperAuditEntry[] {
    const list = userId 
      ? this.auditLog.filter(e => e.userId === userId)
      : this.auditLog;
    return list.slice(-limit).reverse();
  }

  private logAudit(entry: GatekeeperAuditEntry): void {
    this.auditLog.push(entry);
    if (this.auditLog.length > 500) {
      this.auditLog.shift();
    }
  }
}

export const gatekeeper = new GatekeeperService();
