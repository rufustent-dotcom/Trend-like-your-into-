import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Network, 
  FileText, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Save, 
  TrendingUp, 
  Brain, 
  Layers, 
  ShieldAlert, 
  RefreshCw, 
  Send, 
  FileCode, 
  ArrowRight, 
  Info,
  Calendar,
  Sparkles,
  Search,
  ExternalLink,
  Sliders,
  CheckCircle2,
  FolderOpen as ObsidianIcon,
  Users,
  UserPlus,
  Globe,
  Music,
  Film,
  Link2,
  Edit,
  Star,
  MessageSquare,
  X,
  Copy
} from "lucide-react";
import { initialVaultState } from "./initialData";
import { IntelligenceVault, VaultNode, StrategicPattern, StrategicSignal, ActiveProject, ProducerProfile, ShowcaseItem, ProducerReview } from "./types";
import RatingDistribution from "./components/RatingDistribution";
import { PaymentButton } from "./components/PaymentButton";
import SalesDashboard from "./components/SalesDashboard";

export default function App() {
  // --- Workspace State ---
  const [vault, setVault] = useState<IntelligenceVault>(() => {
    const saved = localStorage.getItem("ai_strategic_vault_data_v2");
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (!parsed.producers) {
          parsed.producers = initialVaultState.producers || [];
        } else {
          // Augment with stored reviews or seed reviews from initial state
          parsed.producers = parsed.producers.map((p: any) => {
            const initialMatch = (initialVaultState.producers || []).find(im => im.id === p.id);
            return {
              ...p,
              reviews: p.reviews || initialMatch?.reviews || []
            };
          });
        }
        return parsed as IntelligenceVault;
      } catch (e) { console.error("Error loading saved vault", e); }
    }
    return initialVaultState;
  });

  // Save changes to LocalStorage for complete offline-first durability
  useEffect(() => {
    localStorage.setItem("ai_strategic_vault_data_v2", JSON.stringify(vault));
  }, [vault]);

  // --- UI Routing / Tabs ---
  // "map" (Patterns <=> Signals Bridge), "vault" (Obsidian File Explorer), "thesis" (Executive Board & Chat), "producers" (Creative Registry Profiles), "dashboard" (Sales)
  const [activeTab, setActiveTab] = useState<"map" | "vault" | "thesis" | "producers" | "dashboard">("map");

  // --- SVG Map State ---
  const [selectedPatternId, setSelectedPatternId] = useState<string>("pat-1");
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(null);
  const [filterStrength, setFilterStrength] = useState<"all" | "high" | "medium">("all");
  const [showPatternEditor, setShowPatternEditor] = useState(false);
  const [showSignalEditor, setShowSignalEditor] = useState(false);

  // --- Obsidian Vault Tree State ---
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "dir-root": true,
    "dir-inbox": true,
    "dir-projects": true,
    "dir-system": true
  });
  const [activeFileId, setActiveFileId] = useState<string>("file-thesis");
  const [editMode, setEditMode] = useState<"preview" | "write">("preview");
  const [fileContent, setFileContent] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [targetNewFolder, setTargetNewFolder] = useState<string>("dir-inbox");

  // --- Producer Profiles State ---
  const [selectedProducerId, setSelectedProducerId] = useState<string>("prod-1");
  const [selectedProducerIds, setSelectedProducerIds] = useState<string[]>([]);
  const [producerGenreFilter, setProducerGenreFilter] = useState<string>("All");
  const [producerSearchQuery, setProducerSearchQuery] = useState<string>("");
  
  // Create state
  const [showAddProducerForm, setShowAddProducerForm] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdGenre, setNewProdGenre] = useState("");
  const [newProdExp, setNewProdExp] = useState<number>(5);
  const [newProdBio, setNewProdBio] = useState("");

  // Create showcase state
  const [showAddShowcaseForm, setShowAddShowcaseForm] = useState(false);
  const [newShowcaseTitle, setNewShowcaseTitle] = useState("");
  const [newShowcaseType, setNewShowcaseType] = useState<"Song" | "Film" | "Project" | "Link">("Song");
  const [newShowcaseUrl, setNewShowcaseUrl] = useState("");
  const [newShowcaseDesc, setNewShowcaseDesc] = useState("");

  // Edit profile state
  const [isEditingProducer, setIsEditingProducer] = useState(false);
  const [editProdName, setEditProdName] = useState("");
  const [editProdGenre, setEditProdGenre] = useState("");
  const [editProdExp, setEditProdExp] = useState(1);
  const [editProdBio, setEditProdBio] = useState("");

  // Create review state
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewProject, setNewReviewProject] = useState("");

  // Toast state for summarizing to vault confirmation
  const [toast, setToast] = useState<{ show: boolean; producerName: string; fileName: string; path: string } | null>(null);

  // --- Advisor Advisor State ---
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string; simulation?: boolean }>>([
    { role: "assistant", content: "Executive strategic node established. Ask me anything to map signals, expand project templates, or refine your AI Restructuring Thesis." }
  ]);
  const [userChatInput, setUserChatInput] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);

  // --- Synthesis AI State ---
  const [loadingSynthesis, setLoadingSynthesis] = useState(false);
  const [synthesisRawText, setSynthesisRawText] = useState("");
  const [synthesisResult, setSynthesisResult] = useState<any | null>(null);

  // Sync edited file source state when switching active files
  useEffect(() => {
    const activeNode = vault.nodes[activeFileId];
    if (activeNode && activeNode.type === "file") {
      setFileContent(activeNode.content || "");
    }
  }, [activeFileId, vault.nodes]);

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (toast && toast.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle saving the currently opened file
  const handleSaveFile = () => {
    setVault(prev => {
      const updatedNodes = { ...prev.nodes };
      if (updatedNodes[activeFileId]) {
        updatedNodes[activeFileId] = {
          ...updatedNodes[activeFileId],
          content: fileContent
        };
      }
      return { ...prev, nodes: updatedNodes };
    });
    setEditMode("preview");
  };

  const handleBatchExportProducers = () => {
    const selectedProducers = (vault.producers || []).filter(p => selectedProducerIds.includes(p.id));
    if (selectedProducers.length === 0) return;

    let markdown = `# Registry Summary: Selective Producer Profiles\n`;
    markdown += `Generated: ${new Date().toLocaleString()}\n\n`;
    markdown += `> This automated report synthesizes clinical profiles for selected creative producers within the Intelligence Vault.\n\n`;
    markdown += `--- \n\n`;

    selectedProducers.forEach((p, idx) => {
      markdown += `## ${idx + 1}. ${p.name}\n`;
      markdown += `- **Domain Area:** ${p.genre}\n`;
      markdown += `- **Execution Tenure:** ${p.experienceYears} Years\n\n`;
      markdown += `### Biography & Core Thesis\n${p.bio}\n\n`;
      
      if (p.showcase && p.showcase.length > 0) {
        markdown += `### Active Portfolio Assets\n`;
        p.showcase.forEach(item => {
          markdown += `- **${item.title}** (${item.type})\n`;
          markdown += `  *${item.description}*\n`;
          markdown += `  [Access Asset](${item.url})\n`;
        });
        markdown += `\n`;
      }

      if (p.reviews && p.reviews.length > 0) {
        const avg = (p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length).toFixed(1);
        markdown += `### Strategic Performance Metrics\n`;
        markdown += `**Aggregate Rating:** ${avg}/5.0 based on ${p.reviews.length} validation cycles.\n\n`;
        p.reviews.forEach(rev => {
          markdown += `- **[${rev.rating}/5]** ${rev.reviewerName} | ${rev.date}\n`;
          if (rev.projectName) markdown += `  *Project Context: ${rev.projectName}*\n`;
          markdown += `  > "${rev.comment}"\n\n`;
        });
      }
      markdown += `\n---\n\n`;
    });

    markdown += `\n*End of Executive Registry Summary. Confidential Strategic Asset.*\n`;

    const folderId = "dir-research";
    const fileName = "Registry_Summary.md";
    const folderNode = vault.nodes[folderId];
    if (!folderNode) return;

    const newId = `file-export-${Date.now()}`;
    const sanitizedPath = `${folderNode.path}/${fileName}`;

    setVault(prev => {
      const updatedNodes = { ...prev.nodes };
      
      // Check if file already exists to overwrite or create new
      const existingFileId = Object.keys(updatedNodes).find(id => updatedNodes[id].path === sanitizedPath);
      
      if (existingFileId) {
        updatedNodes[existingFileId] = {
          ...updatedNodes[existingFileId],
          content: markdown
        };
      } else {
        const newNode: VaultNode = {
          id: newId,
          name: fileName,
          path: sanitizedPath,
          type: "file",
          category: "Research",
          content: markdown
        };
        updatedNodes[newId] = newNode;
        
        // Add to folder children
        if (updatedNodes[folderId]) {
          updatedNodes[folderId] = {
            ...updatedNodes[folderId],
            children: [...(updatedNodes[folderId].children || []), newId]
          };
        }
      }

      return { ...prev, nodes: updatedNodes };
    });

    setToast({
      show: true,
      producerName: `${selectedProducers.length} Producers`,
      fileName: fileName,
      path: sanitizedPath
    });
    
    // Clear selection after export
    setSelectedProducerIds([]);
  };

  // Create a new markdown file in the specified category folder
  const handleCreateFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const formattedName = newFileName.endsWith(".md") ? newFileName : `${newFileName}.md`;
    const folderNode = vault.nodes[targetNewFolder];
    if (!folderNode) return;

    const newId = `file-user-${Date.now()}`;
    const sanitizedPath = `${folderNode.path}/${formattedName}`;

    const newFileNode: VaultNode = {
      id: newId,
      name: formattedName,
      path: sanitizedPath,
      type: "file",
      category: folderNode.category,
      content: `# ${newFileName}\nCreated raw signal notes on ${new Date().toLocaleDateString()}.\n\n- Add context observations here.`
    };

    setVault(prev => {
      const updatedNodes = { ...prev.nodes };
      updatedNodes[newId] = newFileNode;

      // Add to folder's children
      const folderChildren = folderNode.children ? [...folderNode.children, newId] : [newId];
      updatedNodes[targetNewFolder] = {
        ...folderNode,
        children: folderChildren
      };

      return { ...prev, nodes: updatedNodes };
    });

    setNewFileName("");
    setActiveFileId(newId);
    setEditMode("write");
  };

  // Delete current file safely
  const handleDeleteFile = (idToDelete: string) => {
    if (idToDelete === "file-thesis") {
      alert("System core file 'CORE_THESIS.md' is protected and cannot be deleted.");
      return;
    }

    setVault(prev => {
      const updatedNodes = { ...prev.nodes };
      delete updatedNodes[idToDelete];

      // Remove from any parent group
      Object.keys(updatedNodes).forEach(key => {
        const node = updatedNodes[key];
        if (node.type === "directory" && node.children?.includes(idToDelete)) {
          updatedNodes[key] = {
            ...node,
            children: node.children.filter(cid => cid !== idToDelete)
          };
        }
      });

      return { ...prev, nodes: updatedNodes };
    });

    // Fall back to main core file
    setActiveFileId("file-thesis");
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Producer Profiles Handler Logic ---
  const handleCreateProducer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newId = `prod-user-${Date.now()}`;
    const newProducer: ProducerProfile = {
      id: newId,
      name: newProdName.trim(),
      genre: newProdGenre.trim() || "General Production",
      experienceYears: Number(newProdExp) || 0,
      bio: newProdBio.trim() || "Creative producer profile on the digital node.",
      showcase: [],
      availability: "Available"
    };

    setVault(prev => {
      const activeProducers = prev.producers || [];
      return {
        ...prev,
        producers: [...activeProducers, newProducer]
      };
    });

    // Reset inputs
    setNewProdName("");
    setNewProdGenre("");
    setNewProdExp(5);
    setNewProdBio("");
    setShowAddProducerForm(false);
    setSelectedProducerId(newId);
  };

  const startEditProducer = (prod: ProducerProfile) => {
    setEditProdName(prod.name);
    setEditProdGenre(prod.genre);
    setEditProdExp(prod.experienceYears);
    setEditProdBio(prod.bio);
    setIsEditingProducer(true);
  };

  const handleUpdateProducer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProdName.trim()) return;

    setVault(prev => {
      const updated = (prev.producers || []).map(p => {
        if (p.id === selectedProducerId) {
          return {
            ...p,
            name: editProdName.trim(),
            genre: editProdGenre.trim() || "General Production",
            experienceYears: Number(editProdExp) || 0,
            bio: editProdBio.trim()
          };
        }
        return p;
      });
      return { ...prev, producers: updated };
    });

    setIsEditingProducer(false);
  };

  const handleDeleteProducer = (id: string) => {
    if (confirm("Are you sure you want to delete this producer profile?")) {
      setVault(prev => {
        const afterDelete = (prev.producers || []).filter(p => p.id !== id);
        return { ...prev, producers: afterDelete };
      });
      
      // Select another producer as active if one exists
      const remaining = (vault.producers || []).filter(p => p.id !== id);
      if (remaining.length > 0) {
        setSelectedProducerId(remaining[0].id);
      } else {
        setSelectedProducerId("");
      }
    }
  };

  const handleCreateShowcaseItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowcaseTitle.trim() || !newShowcaseUrl.trim()) return;

    const newShowcase: ShowcaseItem = {
      id: `showcase-item-${Date.now()}`,
      title: newShowcaseTitle.trim(),
      type: newShowcaseType,
      url: newShowcaseUrl.trim(),
      description: newShowcaseDesc.trim() || "Showcased work details."
    };

    setVault(prev => {
      const updated = (prev.producers || []).map(p => {
        if (p.id === selectedProducerId) {
          return {
            ...p,
            showcase: [...p.showcase, newShowcase]
          };
        }
        return p;
      });
      return { ...prev, producers: updated };
    });

    // Reset showcase inputs
    setNewShowcaseTitle("");
    setNewShowcaseType("Song");
    setNewShowcaseUrl("");
    setNewShowcaseDesc("");
    setShowAddShowcaseForm(false);
  };

  const handleDeleteShowcaseItem = (showcaseItemId: string) => {
    if (confirm("Remove this showcased work from the profile?")) {
      setVault(prev => {
        const updated = (prev.producers || []).map(p => {
          if (p.id === selectedProducerId) {
            return {
              ...p,
              showcase: p.showcase.filter(item => item.id !== showcaseItemId)
            };
          }
          return p;
        });
        return { ...prev, producers: updated };
      });
    }
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewComment.trim()) return;

    const newReview: ProducerReview = {
      id: `review-${Date.now()}`,
      reviewerName: newReviewerName.trim(),
      rating: Number(newReviewRating) || 5,
      comment: newReviewComment.trim(),
      projectName: newReviewProject.trim() || undefined,
      date: new Date().toISOString().split("T")[0]
    };

    setVault(prev => {
      const updated = (prev.producers || []).map(p => {
        if (p.id === selectedProducerId) {
          const updatedReviews = p.reviews ? [...p.reviews, newReview] : [newReview];
          return {
            ...p,
            reviews: updatedReviews
          };
        }
        return p;
      });
      return { ...prev, producers: updated };
    });

    // Reset inputs
    setNewReviewerName("");
    setNewReviewRating(5);
    setNewReviewComment("");
    setNewReviewProject("");
    setShowAddReviewForm(false);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this completed review?")) {
      setVault(prev => {
        const updated = (prev.producers || []).map(p => {
          if (p.id === selectedProducerId) {
            return {
              ...p,
              reviews: (p.reviews || []).filter(r => r.id !== reviewId)
            };
          }
          return p;
        });
        return { ...prev, producers: updated };
      });
    }
  };

  const handleCopyLink = (producerId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#producer=${producerId}`;
    navigator.clipboard.writeText(url);
  };

  const handleExportProducerToMarkdown = (producer: ProducerProfile) => {
    // Generate clean structured markdown content
    const reviews = producer.reviews || [];
    const avgRating = reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "No Ratings Yet";

    let md = `# Producer Profile: ${producer.name}\n\n`;
    md += `## 📋 Core Credentials\n`;
    md += `- **Display Name:** ${producer.name}\n`;
    md += `- **Production Specialty / Specialty:** ${producer.genre}\n`;
    md += `- **Tenure / Experience:** ${producer.experienceYears} Years Exp\n`;
    md += `- **Average Rating Rating:** ⭐ ${avgRating} / 5.0 (based on ${reviews.length} completed project assessment reviews)\n\n`;

    md += `## 👤 Biography & Professional Experience\n`;
    md += `${producer.bio || "No professional biography has been established for this creative producer yet."}\n\n`;

    md += `## 🚀 Portfolio & Outstanding Showcase Assets\n`;
    if (producer.showcase && producer.showcase.length > 0) {
      md += `| Asset Title | Media Type | External Streaming Target | Brief Commentary |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      producer.showcase.forEach(item => {
        md += `| **${item.title}** | \`${item.type}\` | [View Stream / Asset](${item.url}) | ${item.description || "N/A"} |\n`;
      });
    } else {
      md += `*No showcase portfolio items have been published for this creative producer yet.*\n`;
    }
    md += `\n`;

    md += `## ⭐ Client Reviews & Endorsements\n`;
    if (reviews.length > 0) {
      reviews.forEach(review => {
        md += `### 🗣️ ${review.reviewerName} (${review.rating}/5 Stars)\n`;
        if (review.projectName) {
          md += `*Project Context: **${review.projectName}** \| Certified on: ${review.date}*\n`;
        } else {
          md += `*Certified on: ${review.date}*\n`;
        }
        md += `> "${review.comment}"\n\n`;
      });
    } else {
      md += `*No client feedback records found.*\n`;
    }
    md += `\n---\n*Generated automatically from the Creative Registry System on ${new Date().toLocaleDateString()}.*`;

    // Now save this to target folder 'dir-projects'
    const targetFolderId = "dir-projects";
    const folderNode = vault.nodes[targetFolderId];
    if (!folderNode) {
      alert("Error: Projects folder '01_Projects' not found in vault.");
      return;
    }

    const sanitizedFileName = `Producer_${producer.name.replace(/[^a-zA-Z0-9_\-]/g, "_")}.md`;
    const newId = `file-prod-export-${Date.now()}`;
    const sanitizedPath = `${folderNode.path}/${sanitizedFileName}`;

    const newFileNode: VaultNode = {
      id: newId,
      name: sanitizedFileName,
      path: sanitizedPath,
      type: "file",
      category: folderNode.category,
      content: md
    };

    setVault(prev => {
      const updatedNodes = { ...prev.nodes };
      updatedNodes[newId] = newFileNode;

      // Add to folder's children
      const children = folderNode.children || [];
      const folderChildren = children.includes(newId) ? children : [...children, newId];
      updatedNodes[targetFolderId] = {
        ...folderNode,
        children: folderChildren
      };

      return { ...prev, nodes: updatedNodes };
    });

    // Make the user experience extremely slick and beautiful:
    // 1. Direct active file to this new file
    // 2. Transition active tab to vault
    // 3. Open it in read/preview mode so they see the result immediately
    setActiveFileId(newId);
    setEditMode("preview");
    setActiveTab("vault");
    
    // Add expandable visual effect to ensure the folder is visible in UI
    setExpandedFolders(prev => ({ ...prev, [targetFolderId]: true }));

    // Trigger confirmation toast
    setToast({
      show: true,
      producerName: producer.name,
      fileName: sanitizedFileName,
      path: sanitizedPath
    });
  };

  // --- Dynamic SVG Wire Lines Calculation ---
  // Coordinates are generated based on grid counts to enable smooth desktop resizing responsiveness
  const patternsForConnections = useMemo(() => {
    return vault.patterns.filter(p => {
      if (filterStrength === "high") return p.strength === "8/8" || p.strength === "7/8";
      return true;
    });
  }, [vault.patterns, filterStrength]);

  const activePattern = useMemo(() => {
    return vault.patterns.find(p => p.id === selectedPatternId) || vault.patterns[0];
  }, [vault.patterns, selectedPatternId]);

  const activeSignal = useMemo(() => {
    if (!selectedSignalId) return null;
    return vault.signals.find(s => s.id === selectedSignalId) || null;
  }, [vault.signals, selectedSignalId]);

  // --- AI Integrations ---
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    const newUserMessage = { role: "user" as const, content: userChatInput };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserChatInput("");
    setLoadingChat(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, newUserMessage],
          systemContext: {
            patterns: vault.patterns.map(p => ({ title: p.title, strength: p.strength })),
            signals: vault.signals.map(s => ({ title: s.title, impact: s.impact })),
            thesis: vault.coreThesis.primaryThesis
          }
        })
      });

      const data = await response.json();
      if (data.error) {
        setChatMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
      } else {
        setChatMessages(prev => [...prev, { role: "assistant", content: data.content, simulation: data.simulation }]);
      }
    } catch (err: any) {
      setChatMessages(prev => [...prev, { role: "assistant", content: `Fatal connection failure: ${err.message}` }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const triggerGeminiSynthesisOnInbox = async () => {
    setLoadingSynthesis(true);
    setSynthesisResult(null);

    // Grab unprocessed raw thoughts from Inbox or selected node
    const inboxFileNodes = (Object.values(vault.nodes) as VaultNode[]).filter(
      n => n.type === "file" && n.category === "Inbox"
    );
    const combinedInboxText = inboxFileNodes.map(n => `Ref: ${n.name}\n${n.content}\n`).join("\n---\n") || 
      "Raw signals draft on decentralized multi-agent system optimization. Compressing operations down to 10 seconds runs.";

    const sourceText = synthesisRawText.trim() || combinedInboxText;

    try {
      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText })
      });
      const data = await response.json();
      setSynthesisResult(data);

      if (data.synthesized) {
        // Automatically inject synthesized new patterns and signals inside the state
        setVault(prev => {
          const updatedSignals = [...prev.signals];
          const updatedPatterns = [...prev.patterns];

          if (data.signals && Array.isArray(data.signals)) {
            data.signals.forEach((s: any, idx: number) => {
              const sigId = `sig-syn-${Date.now()}-${idx}`;
              updatedSignals.push({
                id: sigId,
                title: s.title,
                impact: s.impact || "High",
                stage: s.stage || "Acceleration",
                description: s.whyItMatters || s.implication || "Synthesized analysis",
                whyItMatters: s.whyItMatters,
                implication: s.implication,
                opportunity: s.opportunity
              });
            });
          }

          if (data.patterns && Array.isArray(data.patterns)) {
            data.patterns.forEach((p: any, idx: number) => {
              updatedPatterns.push({
                id: `pat-syn-${Date.now()}-${idx}`,
                title: p.title,
                strength: p.strength || "7/8",
                impact: p.impact || "High",
                observation: p.observation || "Synthesized pattern.",
                implication: p.implication || "Action required.",
                opportunity: p.opportunity || "Value acquisition.",
                connectedSignalIds: updatedSignals.slice(-3).map(s => s.id) // Bind to last generated signals
              });
            });
          }

          return {
            ...prev,
            signals: updatedSignals,
            patterns: updatedPatterns,
            coreThesis: {
              ...prev.coreThesis,
              primaryThesis: data.updatedThesis || prev.coreThesis.primaryThesis
            }
          };
        });
      }
    } catch (e: any) {
      console.error(e);
      alert("Error carrying out Gemini analytical synthesis.");
    } finally {
      setLoadingSynthesis(false);
    }
  };

  // Reset the vault to baseline initial settings
  const handleResetWorkspace = () => {
    if (confirm("Reset strategic intelligence workspace back to initial baseline configurations? All custom edits will be set to fallback parameters.")) {
      setVault(initialVaultState);
      setActiveFileId("file-thesis");
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 font-sans flex flex-col antialiased selection:bg-[#00f5d4] selection:text-[#07070a]">
      {/* --- Top Command Header --- */}
      <header className="border-b border-zinc-900 bg-[#0c0c10]/98 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#00f5d4] to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,245,212,0.15)]">
            <Layers className="w-5 h-5 text-[#07070a]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-widest text-[#00f5d4] uppercase">Operating System</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-mono border border-emerald-900/50">SECURE SHELL</span>
            </div>
            <h1 className="text-lg font-medium tracking-tight text-white font-mono">AI Strategic Intelligence Vault</h1>
          </div>
        </div>

        {/* Workspace Quick Statistics */}
        <div className="hidden lg:flex items-center gap-6 text-xs border-l border-zinc-900 pl-6">
          <div className="flex flex-col">
            <span className="text-slate-500 font-mono">HIGHEST PRODUCING</span>
            <span className="text-[#00f5d4] font-mono font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#00f5d4]" />
              AI Compresses Time (8/8)
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-mono font-medium">FILES INDEXED</span>
            <span className="text-slate-200 font-mono font-medium">
              {Object.keys(vault.nodes).filter(n => vault.nodes[n].type === "file").length} Markdown Entries
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500 font-mono">STRATEGIC SIGNALS</span>
            <span className="text-slate-200 font-mono font-medium">{vault.signals.length} Signals Captured</span>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800/80">
          <button 
            onClick={() => setActiveTab("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all uppercase ${
              activeTab === "map" 
                ? "bg-slate-800 text-[#00f5d4]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            Patterns Map
          </button>
          <button 
            onClick={() => setActiveTab("vault")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all uppercase ${
              activeTab === "vault" 
                ? "bg-slate-800 text-[#00f5d4]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            Obsidian Vault
          </button>
          <button 
            onClick={() => setActiveTab("thesis")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all uppercase ${
              activeTab === "thesis" 
                ? "bg-slate-800 text-[#00f5d4]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Thesis & AI Advisor
          </button>
          <button 
            onClick={() => setActiveTab("producers")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all uppercase ${
              activeTab === "producers" 
                ? "bg-slate-800 text-[#00f5d4]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Producers Profiles
          </button>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all uppercase ${
              activeTab === "dashboard" 
                ? "bg-slate-800 text-[#00f5d4]" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </header>

      {/* --- Main Workspace Frame --- */}
      <main className="flex-1 flex flex-col">

        {/* --- Tab 1: Interactive Connections Bridge Forge --- */}
        {activeTab === "dashboard" && (
          <div className="flex-1 overflow-y-auto">
            <SalesDashboard vault={vault} />
          </div>
        )}
        {activeTab === "map" && (
          <div className="flex-1 flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-zinc-900">
            {/* Left Bridge Section */}
            <div className="flex-1 px-6 py-6 overflow-y-auto">
              {/* Strategic Insights Intro Banner */}
              <div className="mb-6 bg-gradient-to-r from-zinc-950 to-slate-950 p-4 rounded-xl border border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-[#00f5d4]/10">
                      <Sparkles className="w-4 h-4 text-[#00f5d4]" />
                    </span>
                    <h2 className="text-sm font-[#00f5d4] font-semibold text-white">Active Patterns &hArr; Signals Relationship Model</h2>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Our dynamic ecosystem establishes causation lines. The strongest connections yield structural leverage. 
                    Below is the live matrix—hover or select a core pattern on the left to highlight its supporting signals.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Filters:</span>
                  <select 
                    value={filterStrength} 
                    onChange={(e: any) => setFilterStrength(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 text-xs text-slate-300 rounded px-2.5 py-1 font-mono focus:border-[#00f5d4] focus:outline-none"
                  >
                    <option value="all">Strength: All (5/8+)</option>
                    <option value="high">Strength: High (7/8+)</option>
                  </select>
                  <button 
                    onClick={triggerGeminiSynthesisOnInbox}
                    disabled={loadingSynthesis}
                    className="bg-[#00f5d4] hover:bg-[#00e0c2] text-slate-950 px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1 transition"
                  >
                    {loadingSynthesis ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    Synthesize
                  </button>
                </div>
              </div>

              {/* Connections Interactive SVG Board */}
              <div className="relative border border-zinc-900 rounded-xl bg-zinc-950/40 p-4 shadow-inner min-h-[500px] flex gap-4 overflow-hidden">
                {/* Patterns Column */}
                <div className="w-[45%] flex flex-col gap-3 z-10">
                  <h3 className="text-xs font-mono tracking-widest text-[#00f5d4] uppercase mb-1 border-b border-zinc-900 pb-2">Core Pattern Models</h3>
                  {patternsForConnections.map((p) => {
                    const isSelected = selectedPatternId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPatternId(p.id);
                          setSelectedSignalId(null);
                        }}
                        className={`group p-3 rounded-lg border text-left cursor-pointer transition-all duration-300 relative ${
                          isSelected 
                            ? "bg-slate-900/90 border-[#00f5d4] shadow-[0_0_15px_rgba(0,245,212,0.1)] text-white" 
                            : "bg-zinc-950/60 border-zinc-900 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono font-semibold text-white tracking-tight flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#00f5d4]" : "bg-slate-500Group-hover:bg-[#00f5d4]"}`} />
                            {p.title}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            p.strength === "8/8" 
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-900/60" 
                              : "bg-zinc-900 text-slate-400"
                          }`}>
                            Strength {p.strength}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 group-hover:text-slate-200">
                          {p.observation}
                        </p>
                        {isSelected && (
                          <div className="absolute top-1/2 -right-1 flex transform -translate-y-1/2">
                            <div className="w-2 h-2 rotate-45 bg-[#00f5d4] rounded-sm shadow-[0_0_5px_rgba(0,245,212,0.8)]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Connection SVG Center Bridge */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <svg className="w-full h-full opacity-80">
                    <defs>
                      <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="linkGradientInactive" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#27272a" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#18181b" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    {/* SVG dynamically renders paths between left column and right column */}
                    {patternsForConnections.map((p, pIdx) => {
                      const isPatternActive = selectedPatternId === p.id;
                      const py = 60 + pIdx * 68; // Row layout height estimates
                      return p.connectedSignalIds.map((sigId) => {
                        const sIdx = vault.signals.findIndex(s => s.id === sigId);
                        if (sIdx === -1) return null;
                        const sy = 60 + sIdx * 59;
                        const startsActive = isPatternActive;
                        return (
                          <path
                            key={`${p.id}-${sigId}`}
                            d={`M 310 ${py} C 410 ${py}, 410 ${sy}, 510 ${sy}`} // Responsive bridge
                            stroke={startsActive ? "url(#linkGradient)" : "url(#linkGradientInactive)"}
                            strokeWidth={startsActive ? 2.5 : 0.8}
                            fill="transparent"
                            className="transition-all duration-300"
                            strokeDasharray={startsActive ? "none" : "3,3"}
                          />
                        );
                      });
                    })}
                  </svg>
                </div>

                {/* Signals Column */}
                <div className="w-[45%] ml-auto flex flex-col gap-2 z-10">
                  <h3 className="text-xs font-mono tracking-widest text-[#00f5d4] uppercase mb-1 border-b border-zinc-900 pb-2">Observed Signals</h3>
                  {vault.signals.map((s) => {
                    const isConnected = activePattern?.connectedSignalIds.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        className={`p-2.5 rounded-lg border text-left transition-all duration-300 ${
                          isConnected 
                            ? "bg-slate-900/60 border-slate-700/80 text-white" 
                            : "bg-zinc-950/20 border-zinc-950/80 text-slate-500 opacity-40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-mono font-medium tracking-tight">
                            {s.title}
                          </span>
                          <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                            s.stage === "Acceleration" 
                              ? "bg-blue-950 text-blue-400" 
                              : "bg-amber-950 text-amber-500"
                          }`}>
                            {s.stage}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {s.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pattern/Signal Details Custom Sidebar */}
            <div className="w-full xl:w-[400px] bg-[#09090d]/90 p-6 overflow-y-auto flex flex-col gap-6">
              
              {/* Selected Pattern Detailed Metrics Panel */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono text-[#00f5d4] uppercase tracking-wider">Pattern Explorer</span>
                    <h2 className="text-base font-semibold text-white tracking-tight">{activePattern?.title}</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono bg-zinc-900 px-2.5 py-1 rounded inline-block font-bold">
                    Strength: {activePattern?.strength}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-900 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Real-World Observation</span>
                    <p className="text-slate-300 leading-relaxed">{activePattern?.observation}</p>
                  </div>

                  <div className="bg-zinc-950/50 p-3.5 rounded-lg border border-zinc-900 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider block">Strategic Implication</span>
                    <p className="text-slate-300 leading-relaxed">{activePattern?.implication}</p>
                  </div>

                  <div className="bg-gradient-to-tr from-cyan-950/10 to-slate-950 p-3.5 rounded-lg border border-cyan-950/40 space-y-1 shadow-sm">
                    <span className="text-[10px] text-[#00f5d4] font-mono uppercase tracking-wider block">Valuable Opportunity</span>
                    <p className="text-slate-200 font-medium leading-relaxed">{activePattern?.opportunity}</p>
                  </div>
                </div>
              </div>

              {/* Supported Dynamic Signals section */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-widest text-[#00f5d4] uppercase border-b border-zinc-900 pb-2">
                  Connected Signal Matrix ({activePattern?.connectedSignalIds.length})
                </h4>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {vault.signals
                    .filter(s => activePattern?.connectedSignalIds.includes(s.id))
                    .map(s => (
                      <div 
                        key={s.id} 
                        className="bg-zinc-950/60 p-3 rounded-lg border border-zinc-900 hover:border-slate-800 transition"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-white">{s.title}</span>
                          <span className="text-[9px] bg-slate-900 text-slate-300 font-mono px-2 py-0.5 rounded border border-zinc-800">
                            Impact: {s.impact}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{s.description}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Reset Control */}
              <div className="mt-auto border-t border-zinc-900 pt-4 flex items-center justify-between text-xs font-mono text-slate-600">
                <span>LOCAL STATE CACHE ACTIVE</span>
                <button 
                  onClick={handleResetWorkspace}
                  className="hover:text-red-400 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset Workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Tab 2: The Obsidian Mobile Vault (File System and Raw Editor) --- */}
        {activeTab === "vault" && (
          <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-900 overflow-hidden min-h-[600px]">
            
            {/* Folder Navigation Sidebar */}
            <div className="w-full md:w-[280px] bg-[#0c0c10]/95 flex flex-col overflow-y-auto shrink-0 select-none">
              
              {/* Quick Search */}
              <div className="p-4 border-b border-zinc-900">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Vault..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-950/80 border border-zinc-900 rounded px-3.5 pl-9 py-1.5 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-[#00f5d4] transition"
                  />
                </div>
              </div>

              {/* Obsidian Tree Structure */}
              <div className="flex-1 p-3 space-y-1 text-xs">
                {/* Recursively Render Files & Categories */}
                <div className="flex items-center gap-1.5 px-3 py-2 text-[#00f5d4] hover:bg-zinc-900 rounded font-mono font-semibold tracking-wider">
                  <ObsidianIcon className="w-4 h-4 text-[#00f5d4]" />
                  <span>VAULT INDEX</span>
                </div>

                <div className="pl-2 space-y-0.5 font-mono">
                  {/* Category Folders */}
                  {(Object.values(vault.nodes) as VaultNode[])
                    .filter(n => n.type === "directory" && n.id !== "dir-root")
                    .map(folder => {
                      const isExpanded = !!expandedFolders[folder.id];
                      return (
                        <div key={folder.id} className="space-y-0.5">
                          <div 
                            onClick={() => toggleFolder(folder.id)}
                            className="flex items-center gap-1.5 px-2 py-1.5 text-slate-300 hover:text-white hover:bg-zinc-900/40 rounded cursor-pointer transition select-none"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                            <Folder className="w-4 h-4 text-[#00f5d4] opacity-80" />
                            <span className="truncate">{folder.name}</span>
                            <span className="text-[10px] text-slate-600 ml-auto">({folder.children?.length || 0})</span>
                          </div>

                          {/* Render Children if Folder is Expanded */}
                          {isExpanded && folder.children && (
                            <div className="pl-4 ml-1.5 border-l border-zinc-900 space-y-0.5">
                              {folder.children
                                .map(cid => vault.nodes[cid] as VaultNode)
                                .filter(node => node && (searchQuery === "" || node.name.toLowerCase().includes(searchQuery.toLowerCase())))
                                .map(file => {
                                  const isActive = activeFileId === file.id;
                                  return (
                                    <div
                                      key={file.id}
                                      onClick={() => {
                                        setActiveFileId(file.id);
                                        setEditMode("preview");
                                      }}
                                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded cursor-pointer transition truncate ${
                                        isActive 
                                          ? "bg-slate-900 text-[#00f5d4] border-l-2 border-[#00f5d4]" 
                                          : "text-slate-400 hover:bg-zinc-900/60 hover:text-slate-200"
                                      }`}
                                    >
                                      <FileText className="w-3.5 h-3.5 shrink-0 opacity-80" />
                                      <span className="truncate">{file.name}</span>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {/* Loose Root Files */}
                  <div className="mt-4 pt-2 border-t border-zinc-900">
                    {(Object.values(vault.nodes) as VaultNode[])
                      .filter(n => n.type === "file" && n.category === "Root" && (searchQuery === "" || n.name.toLowerCase().includes(searchQuery.toLowerCase())))
                      .map(file => {
                        const isActive = activeFileId === file.id;
                        return (
                          <div
                            key={file.id}
                            onClick={() => {
                              setActiveFileId(file.id);
                              setEditMode("preview");
                            }}
                            className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer transition truncate max-w-full ${
                              isActive 
                                ? "bg-slate-900 text-[#00f5d4] border-l-2 border-[#00f5d4]" 
                                : "text-slate-400 hover:bg-zinc-900/60 hover:text-slate-200"
                            }`}
                          >
                            <FileCode className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Create New File Area */}
              <div className="p-4 border-t border-zinc-900 bg-zinc-950/20">
                <form onSubmit={handleCreateFile} className="space-y-2.5">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[#00f5d4] uppercase tracking-wider">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Injest New File</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Signal Alpha.md"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#00f5d4] transition"
                  />
                  <div className="flex gap-1">
                    <select
                      value={targetNewFolder}
                      onChange={(e) => setTargetNewFolder(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 text-[10px] text-slate-400 rounded px-2 py-1 focus:outline-none select-none font-mono"
                    >
                      {(Object.values(vault.nodes) as VaultNode[])
                        .filter(n => n.type === "directory" && n.id !== "dir-root")
                        .map(dir => (
                          <option key={dir.id} value={dir.id}>{dir.name}</option>
                        ))}
                    </select>
                    <button
                      type="submit"
                      className="bg-[#00f5d4] hover:bg-[#00e0c2] text-[#07070a] px-2.5 rounded text-xs font-bold transition flex items-center justify-center font-mono"
                    >
                      ADD
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Markdown Workspace Panel */}
            <div className="flex-1 flex flex-col bg-[#07070a] overflow-hidden">
              {/* File Title and Editor Toggle Tabs */}
              <div className="px-6 py-3 border-b border-zinc-900 bg-[#0c0c10]/90 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00f5d4]" />
                  <h2 className="text-sm font-semibold text-white tracking-tight font-mono">{vault.nodes[activeFileId]?.name}</h2>
                  <span className="text-[10px] bg-slate-900 text-slate-500 rounded px-2.5 py-0.5 border border-zinc-800 uppercase font-mono">
                    {vault.nodes[activeFileId]?.category} Archive
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-900/60 p-1 rounded-lg border border-zinc-800">
                  <button
                    onClick={() => setEditMode("preview")}
                    className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
                      editMode === "preview" 
                        ? "bg-slate-800 text-white" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Formatted Reading
                  </button>
                  <button
                    onClick={() => setEditMode("write")}
                    className={`px-3 py-1 rounded text-[11px] font-mono transition-all ${
                      editMode === "write" 
                        ? "bg-slate-800 text-white" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Edit Source
                  </button>
                </div>
              </div>

              {/* Content Panel Area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {editMode === "preview" ? (
                  <div className="prose prose-invert max-w-full leading-relaxed tracking-tight text-slate-300">
                    <div className="bg-zinc-950/20 rounded-xl p-6 border border-zinc-900 shadow-inner">
                      {/* Formatted Markdown Content Synthesizer Simulation Renderer */}
                      <div className="space-y-6">
                        {fileContent.split("\n\n").map((section, idx) => {
                          if (section.startsWith("# ")) {
                            return <h1 key={idx} className="text-xl font-mono font-bold text-white border-b border-zinc-900 pb-2 mt-2">{section.replace("# ", "")}</h1>;
                          }
                          if (section.startsWith("## ")) {
                            return <h2 key={idx} className="text-md font-mono font-semibold text-[#00f5d4] mt-4 mb-2">{section.replace("## ", "")}</h2>;
                          }
                          if (section.startsWith("* ")) {
                            return (
                              <ul key={idx} className="list-disc pl-5 space-y-1 bg-zinc-950/30 p-2 rounded-lg border border-zinc-900/40">
                                {section.split("\n").map((li, lIdx) => (
                                  <li key={lIdx} className="text-slate-300 font-mono text-[11px]">{li.replace("* ", "")}</li>
                                ))}
                              </ul>
                            );
                          }
                          if (section.startsWith("- ")) {
                            return (
                              <ul key={idx} className="list-disc pl-5 space-y-2">
                                {section.split("\n").map((li, lIdx) => (
                                  <li key={lIdx} className="text-slate-300 leading-relaxed font-sans text-xs">{li.replace("- ", "")}</li>
                                ))}
                              </ul>
                            );
                          }
                          // Handle visual table formatting for Deploying stats
                          if (section.includes("|")) {
                            const rows = section.split("\n").filter(r => r.trim() !== "");
                            return (
                              <div key={idx} className="overflow-x-auto my-4 border border-zinc-900 rounded-lg">
                                <table className="w-full text-left text-xs font-mono border-collapse bg-zinc-950/50">
                                  <thead>
                                    <tr className="border-b border-zinc-800 bg-[#0c0c10]">
                                      <th className="p-3 text-slate-400 font-semibold uppercase tracking-wider">Metric Parameter</th>
                                      <th className="p-3 text-slate-400 font-semibold uppercase tracking-wider">Evaluation</th>
                                      <th className="p-3 text-slate-400 font-semibold uppercase tracking-wider">Note Range</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-900">
                                    {rows.slice(2).map((row, rIdx) => {
                                      const cols = row.split("|").filter(c => c.trim() !== "");
                                      if (cols.length < 2) return null;
                                      return (
                                        <tr key={rIdx} className="hover:bg-zinc-900/30 transition">
                                          <td className="p-3 text-white font-medium">{cols[0]?.trim()}</td>
                                          <td className="p-3 text-[#00f5d4]">{cols[1]?.trim()}</td>
                                          <td className="p-3 text-slate-400 text-[11px]">{cols[2]?.trim()}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                          return <p key={idx} className="text-xs leading-relaxed text-slate-300">{section}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col gap-4">
                    <textarea
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="flex-1 w-full h-[500px] bg-zinc-950/90 border border-zinc-900 rounded-xl p-5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[#00f5d4] leading-relaxed resize-none shadow-sm"
                      placeholder="Write structured markdown document here..."
                    />
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-mono text-slate-500">
                        {fileContent.length} CHARACTERS &bull; {fileContent.split(" ").filter(w => w !== "").length} WORDS
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFileContent(vault.nodes[activeFileId]?.content || "")}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-slate-300 rounded text-xs font-mono font-medium transition"
                        >
                          Discard Edits
                        </button>
                        <button
                          onClick={handleSaveFile}
                          className="px-5 py-2 bg-[#00f5d4] hover:bg-[#00e0c2] text-[#07070a] rounded text-xs font-mono font-bold flex items-center gap-1.5 transition"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Commit Changes
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Strategic Intelligence Tool / Analyst Insights Panel */}
            <div className="w-full md:w-[280px] bg-[#09090d]/80 p-6 flex flex-col gap-6 overflow-y-auto">
              
              {/* Context Action Matrix */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono tracking-widest text-[#00f5d4] uppercase border-b border-zinc-900 pb-2">File AI Analyst</h4>
                <p className="text-xs text-slate-400">
                  Trigger server-side synthesis to audit rules, verify security compliance, or match signal trends inside the currently active file automatically.
                </p>

                <button
                  onClick={async () => {
                    setLoadingSynthesis(true);
                    try {
                      const response = await fetch("/api/synthesize", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text: `File: ${vault.nodes[activeFileId]?.name}\n\n${fileContent}` })
                      });
                      const data = await response.json();
                      setSynthesisResult(data);
                      alert(`Analysis Processed!\n\nSummary Metrics:\n${data.summary || "Adhered perfectly to strict schema validation."}`);
                    } catch (e) {
                      alert("AI validation error - make sure GEMINI_API_KEY is configured in Settings.");
                    } finally {
                      setLoadingSynthesis(false);
                    }
                  }}
                  disabled={loadingSynthesis}
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded p-3 text-xs font-mono font-bold border border-zinc-800 flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
                  {loadingSynthesis ? "Analyzing..." : "Analyze File Content"}
                </button>
              </div>

              {/* Active Project Templates ledger */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono tracking-widest text-[#00f5d4] uppercase border-b border-zinc-900 pb-2">Workspace Directories</h4>
                <div className="space-y-2 text-[11px] font-mono text-slate-400">
                  <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-900/80">
                    <span className="text-[#00f5d4] block mb-0.5">00_Inbox</span>
                    Temporary capture pool. Run synthesis regularly on inbox signals.
                  </div>
                  <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-900/80">
                    <span className="text-[#00f5d4] block mb-0.5">01_Projects</span>
                    Active projects, tasks, execution plans, and local codes.
                  </div>
                  <div className="bg-zinc-950/60 p-2.5 rounded border border-zinc-900/80">
                    <span className="text-[#00f5d4] block mb-0.5">02_Research</span>
                    Knowledge assets base tracking psychology and systems thinking.
                  </div>
                </div>
              </div>

              {/* Danger Action */}
              <div className="mt-auto pt-4 border-t border-zinc-900">
                <button
                  onClick={() => handleDeleteFile(activeFileId)}
                  className="w-full text-red-500 hover:text-red-400 hover:bg-red-950/10 rounded py-2 text-xs font-mono font-medium border border-red-950/50 flex items-center justify-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Discard Document
                </button>
              </div>

            </div>

          </div>
        )}

        {/* --- Tab 3: Core Thesis, Supporting Projects + Strategic AI Advisor (Gemini) --- */}
        {activeTab === "thesis" && (
          <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-900 overflow-hidden min-h-[600px]">
            
            {/* Core Thesis and Structured Project templates ledger */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-8">
              
              {/* Section 1: The Core AI Restructuring Thesis */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
                  <span className="p-1.5 rounded bg-blue-950/30 border border-blue-905/30">
                    <Layers className="w-4 h-4 text-[#00f5d4]" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-[#00f5d4] uppercase tracking-wider block">Foundational Thesis</span>
                    <h2 className="text-md font-semibold text-white tracking-tight font-mono">Cognitive Restructuring Strategy</h2>
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-5 space-y-4 shadow-sm">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Primary Thesis Statement</span>
                    <p className="text-sm text-slate-100 font-medium leading-relaxed">
                      {vault.coreThesis.primaryThesis}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-zinc-900">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#00f5d4] uppercase tracking-wider block">Critical Assertions</span>
                      <ul className="space-y-2 text-xs text-slate-400">
                        {vault.coreThesis.supportingAssumptions.map((ass, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-[#00f5d4] font-mono font-bold">0{idx + 1}.</span>
                            <span>{ass}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-[#00f5d4] uppercase tracking-wider block">Major Implications</span>
                      <ul className="space-y-2 text-xs text-slate-400">
                        {vault.coreThesis.majorImplications.map((imp, idx) => (
                          <li key={idx} className="flex gap-2">
                            <span className="text-blue-400 font-mono font-bold">&bull;</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Supporting Strategic Projects Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded bg-emerald-950/30 border border-emerald-900/30">
                      <CheckCircle2 className="w-4 h-4 text-[#00f5d4]" />
                    </span>
                    <div>
                      <span className="text-[10px] font-mono text-[#00f5d4] uppercase tracking-wider block">Investment Execution</span>
                      <h2 className="text-md font-semibold text-white tracking-tight font-mono">Active Strategic Projects</h2>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vault.projects.map((proj) => (
                    <div 
                      key={proj.id}
                      className="bg-zinc-950/30 border border-zinc-900 hover:border-slate-800 rounded-xl p-5 space-y-3.5 transition shadow-sm relative group"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-white group-hover:text-[#00f5d4] transition flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          {proj.title}
                        </span>
                        <span className="text-[9px] bg-slate-900 text-slate-400 rounded-full px-2 py-0.5 border border-zinc-800">
                          {proj.status}
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <p className="text-slate-400 font-sans text-xs line-clamp-2 leading-relaxed">
                          <strong>Objective:</strong> {proj.objective}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-500">
                          <div>
                            <span className="uppercase block text-[9px] text-zinc-650">Market Position</span>
                            <span className="text-slate-300 truncate block">{proj.market}</span>
                          </div>
                          <div>
                            <span className="uppercase block text-[9px] text-zinc-650">Potential Return</span>
                            <span className="text-[#00f5d4] font-bold block">{proj.revenuePotential}</span>
                          </div>
                        </div>

                        <div className="bg-zinc-950/80 p-2.5 border border-zinc-900 rounded font-mono text-[10px] text-slate-300">
                          <span className="text-[#00f5d4] font-bold uppercase tracking-widest text-[9px] block mb-0.5">NEXT MOVE ACTION:</span>
                          {proj.nextStep}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Strategic AI Advisor Panel (Gemini Chat Assistant) */}
            <div className="w-full lg:w-[420px] bg-[#0c0c10]/98 flex flex-col overflow-hidden shrink-0">
              
              {/* Chat Title */}
              <div className="px-6 py-4 border-b border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-[#00f5d4]/10">
                    <Sparkles className="w-4 h-4 text-[#00f5d4]" />
                  </span>
                  <div>
                    <h3 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">Strategic AI Advisor</h3>
                    <span className="text-[10px] text-slate-500 font-mono">Gemini-Powered Workspace Helper</span>
                  </div>
                </div>
                <button
                  onClick={() => setChatMessages([
                    { role: "assistant", content: "Executive strategic node established. How can I assist you with mappings or portfolio synthesis?" }
                  ])}
                  className="text-[10px] text-slate-500 hover:text-white font-mono uppercase"
                >
                  Clear Thread
                </button>
              </div>

              {/* Conversational Stream area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((msg, idx) => {
                  const isAssistant = msg.role === "assistant";
                  return (
                    <div 
                      key={idx} 
                      className={`flex flex-col space-y-1 ${isAssistant ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                        {isAssistant ? (
                          <>
                            <Brain className="w-3 h-3 text-[#00f5d4]" />
                            <span>COGNITIVE CORE</span>
                            {msg.simulation && <span className="text-amber-500 font-bold">&bull; SIMULATION</span>}
                          </>
                        ) : (
                          <>
                            <span>WORKSPACE HOLDER</span>
                          </>
                        )}
                      </div>
                      <div className={`p-3 rounded-lg text-xs leading-relaxed max-w-[90%] font-mono whitespace-pre-wrap ${
                        isAssistant 
                          ? "bg-zinc-900 text-slate-100 border border-zinc-800"
                          : "bg-gradient-to-tr from-[#00f5d4]/15 to-slate-900 border border-[#00f5d4]/25 text-[#00f5d4]"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}

                {loadingChat && (
                  <div className="flex flex-col space-y-1 items-start">
                    <span className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-[#00f5d4]" />
                      <span>COGNITIVE CORE PROCESSING...</span>
                    </span>
                    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-slate-500 font-mono animate-pulse w-32">
                      Synthesizing signals...
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="p-4 border-t border-zinc-900 bg-zinc-950/40">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={userChatInput}
                    onChange={(e) => setUserChatInput(e.target.value)}
                    placeholder="Ask Advisor... e.g. Audit security rules for Jamf Now"
                    className="flex-1 bg-zinc-950 border border-zinc-900 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-650 font-mono focus:outline-none focus:border-[#00f5d4] transition"
                  />
                  <button
                    type="submit"
                    disabled={loadingChat || !userChatInput.trim()}
                    className="bg-[#00f5d4] hover:bg-[#00e0c2] text-[#07070a] px-3.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

        {/* --- Tab 4: Producers User Registry System --- */}
        {activeTab === "producers" && (
          <div className="flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-zinc-900 overflow-hidden min-h-[600px]" id="producer-system-root">
            
            {/* Left Column: List Directory and Registration Controls */}
            <div className="w-full lg:w-[350px] bg-zinc-950/40 p-6 overflow-y-auto space-y-6 flex flex-col border-b lg:border-b-0 border-zinc-900" id="producer-directory-sidebar">
              
              {/* Header and Add Button */}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#00f5d4]" />
                    Producer Directory
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">Registry ledger for creative staff</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <PaymentButton />
                  {selectedProducerIds.length > 0 && (
                    <motion.button
                      id="btn-batch-export"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={handleBatchExportProducers}
                      className="flex items-center gap-1.5 px-2 py-1.5 bg-[#00f5d4]/10 border border-[#00f5d4]/20 text-[#00f5d4] rounded text-[10px] font-mono hover:bg-[#00f5d4]/20 transition-all"
                      title="Export selected profiles to Registry_Summary.md"
                    >
                      <Save className="w-3 h-3" />
                      Export ({selectedProducerIds.length})
                    </motion.button>
                  )}
                  
                  <button
                    id="btn-toggle-add-producer"
                    onClick={() => {
                      setShowAddProducerForm(!showAddProducerForm);
                      if (!showAddProducerForm) {
                        setNewProdName("");
                        setNewProdGenre("Music & Audio Engineering");
                        setNewProdExp(5);
                        setNewProdBio("");
                      }
                    }}
                    className={`p-1.5 rounded border transition-all ${
                      showAddProducerForm
                        ? "bg-red-950/30 border-red-900/50 text-red-400 hover:bg-red-900/40"
                        : "bg-[#00f5d4]/10 border-[#00f5d4]/20 text-[#00f5d4] hover:bg-[#00f5d4]/20"
                    }`}
                    title={showAddProducerForm ? "Cancel Add" : "Register New Producer"}
                  >
                    {showAddProducerForm ? <Plus className="w-3.5 h-3.5 rotate-45 transition-transform" /> : <UserPlus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Registration Form (Collapsible) */}
              {showAddProducerForm && (
                <form 
                  id="add-producer-form"
                  onSubmit={handleCreateProducer} 
                  className="bg-zinc-900/80 p-4 rounded-lg border border-zinc-805/80 space-y-3 font-mono text-[11px]"
                >
                  <div className="text-[10px] font-bold text-[#00f5d4] uppercase tracking-wider border-b border-zinc-850 pb-1 text-left">
                    New Profile Application
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <label className="text-slate-400 block">Producer Name *</label>
                    <input
                      id="input-prod-name"
                      type="text"
                      required
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Liam Sterling"
                      className="w-full bg-zinc-950 border border-zinc-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4] transition font-sans"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-slate-400 block">Production Genre *</label>
                    <select
                      id="input-prod-genre"
                      required
                      value={newProdGenre}
                      onChange={(e) => setNewProdGenre(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-[#00f5d4] transition"
                    >
                      <option value="">-- Choose Genre --</option>
                      <option value="Music & Audio Engineering">Music & Audio Engineering</option>
                      <option value="Cinematic Sound Design & Game Audio">Cinematic Sound Design & Game Audio</option>
                      <option value="Film & Video Production">Film & Video Production</option>
                      <option value="Interactive Media & VR">Interactive Media & VR</option>
                      <option value="Creative Directing & Strategy">Creative Directing & Strategy</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-slate-400 block">Experience (Years): {newProdExp}</label>
                    <input
                      id="input-prod-exp"
                      type="range"
                      min="0"
                      max="30"
                      value={newProdExp}
                      onChange={(e) => setNewProdExp(Number(e.target.value))}
                      className="w-full accent-[#00f5d4] py-1 cursor-pointer bg-transparent"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-slate-400 block">Brief Professional Biography</label>
                    <textarea
                      id="input-prod-bio"
                      rows={3}
                      value={newProdBio}
                      onChange={(e) => setNewProdBio(e.target.value)}
                      placeholder="Describe creative fields, influences..."
                      className="w-full bg-zinc-950 border border-zinc-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4] transition resize-none"
                    />
                  </div>

                  <button
                    id="btn-save-producer"
                    type="submit"
                    className="w-full bg-[#00f5d4] hover:bg-[#00e0c2] text-[#07070a] font-bold py-1.5 rounded transition uppercase tracking-wider text-[10px]"
                  >
                    Establish Profile
                  </button>
                </form>
              )}

              {/* Filtering and Query Tools */}
              <div className="space-y-2 font-mono">
                {/* Search string */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Search className="w-3 h-3 text-slate-500" />
                  </span>
                  <input
                    id="search-producers"
                    type="text"
                    value={producerSearchQuery}
                    onChange={(e) => setProducerSearchQuery(e.target.value)}
                    placeholder="Search systems..."
                    className="w-full bg-zinc-900/50 border border-zinc-950 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#00f5d4] transition"
                  />
                </div>

                {/* Genre Tabs */}
                <div className="flex flex-wrap gap-1 pt-1" id="genre-filters">
                  {["All", "Music", "Sound Design", "Film", "Interactive"].map((g) => {
                    const isActive = producerGenreFilter === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setProducerGenreFilter(g)}
                        className={`px-2 py-0.5 rounded text-[9px] border transition ${
                          isActive
                            ? "bg-slate-900 border-zinc-800 text-[#00f5d4] font-bold"
                            : "bg-zinc-950/45 border-transparent text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recipient Ledger / Directory Stack list */}
              <div className="flex-1 space-y-1.5 overflow-y-auto pr-1" id="producers-list-box">
                {((vault.producers || []) as ProducerProfile[])
                  .filter(p => {
                    const matchesSearch = p.name.toLowerCase().includes(producerSearchQuery.toLowerCase()) || 
                                          p.genre.toLowerCase().includes(producerSearchQuery.toLowerCase());
                    if (producerGenreFilter === "All") return matchesSearch;
                    
                    if (producerGenreFilter === "Music") return matchesSearch && p.genre.toLowerCase().includes("music");
                    if (producerGenreFilter === "Sound Design") return matchesSearch && (p.genre.toLowerCase().includes("sound") || p.genre.toLowerCase().includes("audio"));
                    if (producerGenreFilter === "Film") return matchesSearch && (p.genre.toLowerCase().includes("film") || p.genre.toLowerCase().includes("video"));
                    if (producerGenreFilter === "Interactive") return matchesSearch && (p.genre.toLowerCase().includes("interactive") || p.genre.toLowerCase().includes("media") || p.genre.toLowerCase().includes("vr"));
                    return matchesSearch;
                  })
                  .map(producer => {
                    const isSelected = selectedProducerId === producer.id;
                    const reviews = producer.reviews || [];
                    const averageRating = reviews.length > 0 
                      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                      : null;

                    return (
                      <div
                        key={producer.id}
                        id={`producer-card-${producer.id}`}
                        onClick={() => {
                          setSelectedProducerId(producer.id);
                          setIsEditingProducer(false); // Close edit state when switching profile
                        }}
                        className={`group relative p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-zinc-900/90 border-[#00f5d4]/40"
                            : "bg-zinc-900/30 border-transparent hover:bg-zinc-900/30"
                        }`}
                      >
                        {/* Multi-select checkbox */}
                        <button
                          id={`btn-toggle-select-${producer.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProducerIds(prev => 
                              prev.includes(producer.id) 
                                ? prev.filter(id => id !== producer.id) 
                                : [...prev, producer.id]
                            );
                          }}
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors mr-3 shrink-0 ${
                            selectedProducerIds.includes(producer.id)
                              ? "bg-[#00f5d4] border-[#00f5d4] text-zinc-950"
                              : "border-zinc-800 bg-zinc-950 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </button>

                        <div className="space-y-1 font-mono text-left flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className={`text-xs font-semibold flex items-center gap-1.5 truncate ${isSelected ? "text-[#00f5d4]" : "text-slate-300"}`}>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? "bg-[#00f5d4]" : "bg-zinc-650"}`} />
                              <span className="truncate">{producer.name}</span>
                              <span className="relative flex h-1.5 w-1.5">
                                {producer.availability === 'Available' && (
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                )}
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${producer.availability === 'Available' ? 'bg-green-500' : 'bg-red-500'}`} title={producer.availability} />
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setVault(prev => ({
                                    ...prev,
                                    producers: (prev.producers || []).map(p => p.id === producer.id ? { ...p, availability: p.availability === 'Available' ? 'Busy' : 'Available' } : p)
                                  }));
                                }}
                                className={`text-[8px] px-1 py-0.5 rounded border border-zinc-700 hover:border-zinc-500 transition-colors ${producer.availability === 'Available' ? 'text-green-500' : 'text-red-500'}`}
                              >
                                {producer.availability}
                              </button>
                              {averageRating && (
                                <div className="flex items-center gap-0.5 bg-yellow-400/10 text-yellow-400 px-1 py-0.5 rounded text-[8px] font-bold shrink-0">
                                  <Star className="w-2 h-2 fill-yellow-400 text-yellow-450" />
                                  <span>{averageRating}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-[9px] text-slate-500 leading-none truncate max-w-[200px]">
                            {producer.genre}
                          </div>
                          <div className="text-[9px] text-slate-400 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-2.5 h-2.5 text-[#00f5d4]/50 hover:text-[#00f5d4]" />
                              <span>{producer.experienceYears} Years Exp</span>
                            </span>
                          </div>
                        </div>

                        {/* Hover Tooltip */}
                        <div className="absolute left-full ml-4 w-48 bg-zinc-800 border border-zinc-700 p-3 rounded shadow-xl invisible group-hover:visible z-50 text-[11px] text-slate-200 pointer-events-none">
                          <p className="font-semibold text-white mb-1">Summary</p>
                          <p><span className="text-slate-400">Genre:</span> {producer.genre}</p>
                          <p><span className="text-slate-400">Rating:</span> {averageRating || 'N/A'}</p>
                          <p><span className="text-slate-400">Showcase Assets:</span> {(producer.showcase || []).length}</p>
                        </div>

                        {/* Profile Delete control */}
                        <button
                          id={`btn-delete-producer-${producer.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProducer(producer.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-950/40 text-red-500 hover:text-red-400 transition"
                          title="Erase Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                {((vault.producers || []) as ProducerProfile[]).length === 0 && (
                  <div className="text-center py-8 font-mono text-[10px] text-slate-650 border border-dashed border-zinc-900 rounded-lg">
                    No registered producer profiles found.
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Dynamic Deep Dive View, Active Showcase Deck & Editor */}
            <div className="flex-1 bg-zinc-950 flex flex-col overflow-y-auto" id="producer-details-viewport">
              
              {/* Dynamic Selector Header */}
              {(() => {
                const activeProducer = (vault.producers || []).find(p => p.id === selectedProducerId);
                
                if (!activeProducer) {
                  return (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 font-mono" id="no-producer-selected-panel">
                      <div className="p-4 rounded-full bg-zinc-905 border border-zinc-900 mb-3 animate-pulse">
                        <Users className="w-8 h-8 text-slate-700" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Strategic Node Idle</h4>
                      <p className="text-[10px] max-w-xs mt-1">
                        Select an active producer from the registry to interface credentials, research portfolios, and creative project outputs.
                      </p>
                    </div>
                  );
                }

                const activeReviews = activeProducer.reviews || [];
                const activeAvgRating = activeReviews.length > 0
                  ? (activeReviews.reduce((sum, r) => sum + r.rating, 0) / activeReviews.length).toFixed(1)
                  : null;

                return (
                  <div className="flex-1 flex flex-col divide-y divide-zinc-900" id={`active-producer-deck-${activeProducer.id}`}>
                    
                    {/* Top Deck Info Block */}
                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Identity Row */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        
                        {/* Avatar initials + Names */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#00f5d4]/20 to-slate-900 border border-[#00f5d4]/30 flex items-center justify-center text-md font-mono font-black text-[#00f5d4] select-none shadow-md">
                            {activeProducer.name.split(" ").map(w => w[0]).join("").substring(0,2).toUpperCase()}
                          </div>
                          <div className="space-y-1 block text-left">
                            <div className="flex items-center gap-3">
                              <h2 className="text-lg font-bold text-white tracking-tight font-sans">{activeProducer.name}</h2>
                              <span className="px-2 py-0.5 rounded bg-[#00f5d4]/10 border border-[#00f5d4]/20 text-[9px] font-mono text-[#00f5d4] font-semibold uppercase">
                                PRODUCER PROFILE
                              </span>
                            </div>
                            <p className="text-xs font-mono text-slate-450 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#00f5d4]" />
                              {activeProducer.genre}
                            </p>
                          </div>
                        </div>

                        {/* Top Utility Edit Deck */}
                        <div className="flex items-center gap-2 font-mono justify-start md:justify-end flex-wrap">
                          <button
                            id="btn-export-producer-md"
                            onClick={() => handleExportProducerToMarkdown(activeProducer)}
                            className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-3 py-1.5 rounded-md text-[10px] uppercase font-bold hover:bg-purple-500/20 transition flex items-center gap-1"
                            title="Generate a structured markdown summary of the producer's profile, reviews, and portfolio, and save it to '01_Projects'"
                          >
                            <FileText className="w-3 h-3 text-purple-400" />
                            Summary to Vault
                          </button>

                          <button
                            id="btn-copy-producer-link"
                            onClick={() => handleCopyLink(activeProducer.id)}
                            className="bg-zinc-800/50 border border-zinc-700 text-slate-300 px-3 py-1.5 rounded-md text-[10px] uppercase font-bold hover:bg-zinc-700 transition flex items-center gap-1"
                            title="Copy shareable link to this producer profile"
                          >
                            <Copy className="w-3 h-3" />
                            Copy Link
                          </button>

                          <button
                            id="btn-edit-producer"
                            onClick={() => {
                              if (isEditingProducer) {
                                setIsEditingProducer(false);
                              } else {
                                startEditProducer(activeProducer);
                              }
                            }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md border text-[10px] uppercase font-bold transition ${
                              isEditingProducer
                                ? "bg-red-950/20 border-red-900 text-red-400"
                                : "bg-zinc-900 border-zinc-800 text-slate-300 hover:text-white"
                            }`}
                          >
                            <Edit className="w-3 h-3" />
                            {isEditingProducer ? "Cancel" : "Edit Profile"}
                          </button>

                          <button
                            id="btn-add-showcase-collapsible"
                            onClick={() => setShowAddShowcaseForm(!showAddShowcaseForm)}
                            className="bg-[#00f5d4]/10 border border-[#00f5d4]/20 text-[#00f5d4] px-3 py-1.5 rounded-md text-[10px] uppercase font-bold hover:bg-[#00f5d4]/20 transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Showcase
                          </button>
                        </div>

                      </div>

                      {/* EDIT MODAL/FORM INLINE inside detail deck */}
                      {isEditingProducer ? (
                        <form 
                          id="edit-producer-form"
                          onSubmit={handleUpdateProducer} 
                          className="bg-zinc-900/90 p-5 rounded-lg border border-zinc-800 space-y-4 font-mono text-[11px]"
                        >
                          <div className="text-[10px] font-black text-[#00f5d4] uppercase tracking-widest flex items-center gap-1 border-b border-zinc-855 pb-2 text-left">
                            <Sliders className="w-3.5 h-3.5" /> Reconfiguring Profile Variables
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div className="space-y-1">
                              <label className="text-slate-400 block font-bold">Display Name</label>
                              <input
                                id="edit-prod-name"
                                type="text"
                                required
                                value={editProdName}
                                onChange={(e) => setEditProdName(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 text-slate-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4] font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-slate-400 block font-bold">Production Field</label>
                              <input
                                id="edit-prod-genre"
                                type="text"
                                required
                                value={editProdGenre}
                                onChange={(e) => setEditProdGenre(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 text-slate-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div className="space-y-1 md:col-span-1">
                              <label className="text-slate-400 block font-bold">Experience (Years): {editProdExp}</label>
                              <input
                                id="edit-prod-exp"
                                type="range"
                                min="0"
                                max="40"
                                value={editProdExp}
                                onChange={(e) => setEditProdExp(Number(e.target.value))}
                                className="w-full accent-[#00f5d4] py-1 cursor-pointer"
                              />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-slate-400 block font-bold">Biography Summary</label>
                              <textarea
                                id="edit-prod-bio"
                                rows={2}
                                value={editProdBio}
                                onChange={(e) => setEditProdBio(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-805 text-slate-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4] resize-none"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800 font-mono text-[10px]">
                            <button
                              id="btn-cancel-edit"
                              type="button"
                              onClick={() => setIsEditingProducer(false)}
                              className="px-4 py-1.5 rounded bg-zinc-950 text-slate-400 hover:text-white border border-zinc-800"
                            >
                              Dismiss Changes
                            </button>
                            <button
                              id="btn-save-edit"
                              type="submit"
                              className="bg-[#0ff] text-zinc-950 font-bold px-4 py-1.5 rounded hover:bg-[#00f5d4] transition flex items-center gap-1"
                            >
                              <Save className="w-3.5 h-3.5" />
                              Commit State
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4" id="producer-analytics-slate">
                          
                          {/* Left Stats Grid */}
                          <div className="md:col-span-1 border border-zinc-900 bg-zinc-950/60 p-4 rounded-lg flex flex-col justify-center space-y-1 text-center md:text-left font-mono">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-left">Tenure Scale</span>
                            <span className="text-2xl font-black text-white text-left">{activeProducer.experienceYears} <span className="text-xs text-slate-400 font-normal">Years</span></span>
                            <div className="w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                              <div 
                                className="bg-[#00f5d4] h-full" 
                                style={{ width: `${Math.min(100, (activeProducer.experienceYears / 25) * 100)}%` }} 
                              />
                            </div>
                          </div>

                          {/* Average Rating Stats Block */}
                          <div id="average-rating-display-block" className="md:col-span-1 border border-zinc-900 bg-zinc-950/60 p-4 rounded-lg flex flex-col justify-center space-y-1 text-center md:text-left font-mono">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-left">Average Rating</span>
                            <div className="flex items-center gap-1.5 justify-center md:justify-start">
                              <span className="text-2xl font-black text-white">{activeAvgRating || "N/A"}</span>
                              {activeAvgRating && (
                                <div className="flex text-yellow-400">
                                  {Array.from({ length: 5 }).map((_, i) => {
                                    const ratingNum = parseFloat(activeAvgRating);
                                    const isFilled = i < Math.round(ratingNum);
                                    return (
                                      <Star key={i} className={`w-3 h-3 ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-zinc-800"}`} />
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] text-slate-500 block text-left capitalize">
                              {activeReviews.length} Project Review{activeReviews.length !== 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* D3 Star Ratings Distribution Chart */}
                          <div id="rating-distribution-chart-block" className="md:col-span-1 border border-zinc-900 bg-zinc-950/60 p-3 rounded-lg flex flex-col justify-center space-y-1 text-center md:text-left font-mono min-h-[90px]">
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block text-left">Rating Distribution</span>
                            <RatingDistribution reviews={activeReviews} />
                          </div>

                          {/* Professional summary Bio description */}
                          <div className="md:col-span-2 border border-zinc-900 bg-zinc-950/20 p-4 rounded-lg flex flex-col justify-center">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 block text-left">Biography & Credentials</span>
                            <p className="text-xs text-slate-300 leading-relaxed text-left font-mono whitespace-pre-wrap max-h-[85px] overflow-y-auto">
                              {activeProducer.bio || "No professional biography has been established for this creative producer yet."}
                            </p>
                          </div>

                        </div>
                      )}

                    </div>

                    {/* SHOWCASE SECTION */}
                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Section Title & Add Showcase toggle inline block */}
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3" id="showcase-section-header">
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-[#00f5d4]" />
                            Portfolio & Best Work Projects
                          </h3>
                          <p className="text-[10px] text-slate-500 font-mono">Dynamic stream showcasing highlight creative media</p>
                        </div>
                        
                        <div className="font-mono text-[10px] text-[#00f5d4]">
                          {activeProducer.showcase?.length || 0} Assets Published
                        </div>
                      </div>

                      {/* Showcase add form collapsible */}
                      {showAddShowcaseForm && (
                        <form 
                          id="add-showcase-form"
                          onSubmit={handleCreateShowcaseItem} 
                          className="bg-zinc-900/60 p-5 rounded-lg border border-zinc-800 space-y-4 font-mono text-[11px]"
                        >
                          <div className="text-[10px] font-black text-[#00f5d4] uppercase tracking-wider flex items-center justify-between pb-1 text-left">
                            <span>Add Showcase Asset</span>
                            <span className="text-slate-500 font-normal">Active Session Node</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                            
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-slate-400 block">Asset Title *</label>
                              <input
                                id="input-asset-title"
                                type="text"
                                required
                                value={newShowcaseTitle}
                                onChange={(e) => setNewShowcaseTitle(e.target.value)}
                                placeholder="e.g. Shattered Grid Epic Teaser Remix"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4]"
                              />
                            </div>

                            <div className="md:col-span-1 space-y-1">
                              <label className="text-slate-400 block">Media Type *</label>
                              <select
                                id="input-asset-type"
                                required
                                value={newShowcaseType}
                                onChange={(e) => setNewShowcaseType(e.target.value as any)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded text-[#00f5d4] px-2 py-1.5 focus:outline-none focus:border-[#00f5d4]"
                              >
                                <option value="Song">Song (Audio Track)</option>
                                <option value="Film">Film (Video / Short Movie)</option>
                                <option value="Project">Project (Interactive App)</option>
                                <option value="Link">Link (Personal Asset / Website)</option>
                              </select>
                            </div>

                            <div className="md:col-span-1 space-y-1">
                              <label className="text-slate-400 block">Deploy Actions</label>
                              <button
                                id="btn-save-asset"
                                type="submit"
                                className="w-full bg-[#00f5d4] hover:bg-[#00e0c2] text-[#07070a] font-bold py-1.5 rounded transition uppercase tracking-wider text-[10px] flex items-center justify-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" /> Append Asset
                              </button>
                            </div>

                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div className="md:col-span-1 space-y-1">
                              <label className="text-slate-400 block">External Streaming URL *</label>
                              <input
                                id="input-asset-url"
                                type="url"
                                required
                                value={newShowcaseUrl}
                                onChange={(e) => setNewShowcaseUrl(e.target.value)}
                                placeholder="https://soundcloud.com/..."
                                className="w-full bg-zinc-950 border border-zinc-850 rounded text-[#00f5d4] px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4]"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                              <label className="text-slate-400 block">Brief Asset Commentary</label>
                              <input
                                id="input-asset-desc"
                                type="text"
                                value={newShowcaseDesc}
                                onChange={(e) => setNewShowcaseDesc(e.target.value)}
                                placeholder="Highlight dynamic elements, specific technology, or key accomplishments..."
                                className="w-full bg-zinc-950 border border-zinc-800 rounded text-slate-200 px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4]"
                              />
                            </div>
                          </div>

                        </form>
                      )}

                      {/* Showcase lists list cards, styled like rich playable media channels */}
                      <div className="grid grid-cols-1 gap-4" id="showcase-assets-grid">
                        {(activeProducer.showcase || []).map((item) => {
                          return (
                            <div
                              key={item.id}
                              id={`showcase-card-${item.id}`}
                              className="group border border-zinc-900 bg-zinc-900/10 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition hover:bg-zinc-900/30"
                            >
                              <div className="flex items-start gap-3.5 text-left font-mono">
                                <div className="mt-1 w-8 h-8 rounded bg-zinc-955/65 border border-zinc-850 flex items-center justify-center text-[#00f5d4] shrink-0">
                                  {item.type === "Song" && <Music className="w-4 h-4" />}
                                  {item.type === "Film" && <Film className="w-4 h-4" />}
                                  {item.type === "Project" && <Layers className="w-4 h-4 text-[#00f5d4]" />}
                                  {item.type === "Link" && <Globe className="w-4 h-4" />}
                                </div>
                                <div className="space-y-1 max-w-xl">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-xs font-bold text-slate-200 leading-tight">{item.title}</h4>
                                    <span className="px-1.5 py-0.5 bg-zinc-950 text-slate-500 rounded text-[8px] uppercase tracking-widest font-mono select-none">
                                      {item.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                                    {item.description || "No commentary established."}
                                  </p>
                                  <div className="text-[9px] text-[#00f5d4]/70 hover:text-[#00f5d4] flex items-center gap-1 select-none">
                                    <Link2 className="w-3 h-3 text-[#00f5d4]/80" />
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="underline font-mono truncate max-w-[280px]">
                                      {item.url}
                                    </a>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center font-mono text-[9px] leading-tight">
                                {/* Clickable link button */}
                                <a 
                                  href={item.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-zinc-900 hover:bg-zinc-800/80 p-2 border border-zinc-800 rounded text-slate-300 hover:text-[#00f5d4] transition flex items-center gap-1.5"
                                >
                                  <span>View Asset</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>

                                {/* Delete Showcase option */}
                                <button
                                  id={`btn-delete-showcase-${item.id}`}
                                  onClick={() => handleDeleteShowcaseItem(item.id)}
                                  className="p-2 border border-transparent rounded hover:bg-red-950/20 text-slate-600 hover:text-red-500 transition"
                                  title="Remove showcased work Asset"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}

                        {(activeProducer.showcase || []).length === 0 && (
                          <div className="text-center py-10 font-mono text-[10px] text-slate-650 border border-dashed border-zinc-900 rounded-lg">
                            No showcase assets published for {activeProducer.name} yet. Click "Add Showcase" above to begin.
                          </div>
                        )}
                      </div>

                    </div>

                    {/* REVIEWS & RATINGS SECTION */}
                    <div className="p-6 md:p-8 space-y-6 border-t border-zinc-900" id="reviews-section-root">
                      
                      {/* Section Title & Toggle form action */}
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3" id="reviews-section-header">
                        <div className="text-left font-mono">
                          <h3 className="text-sm font-semibold text-white font-sans flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            Client Reviews & Dynamic Ratings
                          </h3>
                          <p className="text-[10px] text-slate-505 font-mono">Verified assessment summaries & completion parameters</p>
                        </div>
                        
                        <button
                          id="btn-toggle-add-review"
                          onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                          className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-md text-[10px] uppercase font-bold hover:bg-yellow-500/20 transition flex items-center gap-1 font-mono"
                        >
                          <Plus className={`w-3.5 h-3.5 transition-transform ${showAddReviewForm ? "rotate-45" : ""}`} />
                          {showAddReviewForm ? "Cancel" : "Add Review"}
                        </button>
                      </div>

                      {/* Write Review Collapsible Form */}
                      {showAddReviewForm && (
                        <form 
                          id="add-review-form"
                          onSubmit={handleCreateReview}
                          className="bg-zinc-900/60 p-5 rounded-lg border border-zinc-800 space-y-4 font-mono text-[11px]"
                        >
                          <div className="text-[10px] font-black text-[#00f5d4] uppercase tracking-widest flex items-center gap-1.5 border-b border-zinc-850 pb-2 text-left">
                            <MessageSquare className="w-3.5 h-3.5 text-[#00f5d4]" /> New Project Endorsement
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
                            
                            <div className="md:col-span-1.5 space-y-1">
                              <label className="text-slate-400 block font-bold">Your Name *</label>
                              <input
                                id="input-review-name"
                                type="text"
                                required
                                value={newReviewerName}
                                onChange={(e) => setNewReviewerName(e.target.value)}
                                placeholder="e.g. Rachel Foster"
                                className="w-full bg-zinc-950 border border-zinc-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4]"
                              />
                            </div>

                            <div className="md:col-span-1.5 space-y-1">
                              <label className="text-slate-400 block font-bold">Completed Project Title</label>
                              <input
                                id="input-review-project"
                                type="text"
                                value={newReviewProject}
                                onChange={(e) => setNewReviewProject(e.target.value)}
                                placeholder="e.g. Corridor Dreams Promo Walk"
                                className="w-full bg-zinc-950 border border-zinc-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4]"
                              />
                            </div>

                            <div className="md:col-span-1 space-y-1">
                              <label className="text-slate-400 block font-bold">Star Rating *</label>
                              <div className="flex items-center gap-1 py-1 select-none">
                                {[1, 2, 3, 4, 5].map((starVal) => {
                                  const isLit = starVal <= newReviewRating;
                                  return (
                                    <button
                                      key={starVal}
                                      type="button"
                                      onClick={() => setNewReviewRating(starVal)}
                                      className="transition-transform active:scale-95 hover:scale-110 p-0.5 focus:outline-none"
                                      title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                                    >
                                      <Star
                                        className={`w-4 h-4 transition-colors ${
                                          isLit 
                                            ? "fill-yellow-400 text-yellow-400" 
                                            : "text-zinc-700 hover:text-yellow-400/50"
                                        }`}
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                          </div>

                          <div className="space-y-1 text-left">
                            <label className="text-slate-400 block font-bold">Assessments & Professional Reviews *</label>
                            <textarea
                              id="input-review-comment"
                              rows={3}
                              required
                              value={newReviewComment}
                              onChange={(e) => setNewReviewComment(e.target.value)}
                              placeholder="Review quality, timeliness, communications, overall impression..."
                              className="w-full bg-zinc-950 border border-zinc-800 text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-[#00f5d4] resize-none font-sans text-xs"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                            <button
                              id="btn-cancel-review"
                              type="button"
                              onClick={() => {
                                setShowAddReviewForm(false);
                                setNewReviewerName("");
                                setNewReviewRating(5);
                                setNewReviewComment("");
                                setNewReviewProject("");
                              }}
                              className="px-4 py-1.5 rounded bg-zinc-950 text-slate-400 hover:text-white border border-zinc-800"
                            >
                              Discard Form
                            </button>
                            <button
                              id="btn-save-review"
                              type="submit"
                              className="bg-[#00f5d4] hover:bg-[#00e0c2] text-zinc-950 font-bold px-4 py-1.5 rounded transition uppercase tracking-wider text-[10px] flex items-center justify-center gap-1"
                            >
                              <Save className="w-3.5 h-3.5" /> Submit Assessment
                            </button>
                          </div>

                        </form>
                      )}

                      {/* Reviews Stack Box */}
                      <div className="grid grid-cols-1 gap-4" id="producer-reviews-grid">
                        {activeReviews.map((review) => {
                          return (
                            <div
                              key={review.id}
                              id={`review-card-${review.id}`}
                              className="group border border-zinc-900 bg-zinc-900/10 rounded-lg p-5 flex flex-col justify-between gap-3.5 transition hover:bg-zinc-900/25 text-left font-mono"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-3">
                                    <h4 className="text-xs font-bold text-white leading-tight">{review.reviewerName}</h4>
                                    <div className="flex items-center text-yellow-400 select-none">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-450" : "text-zinc-800"}`} 
                                        />
                                      ))}
                                    </div>
                                    <span className="text-[9px] text-slate-500">{review.date}</span>
                                  </div>

                                  {review.projectName && (
                                    <div className="text-[9px] text-[#00f5d4] uppercase font-bold tracking-wider select-none py-0.5 rounded leading-none">
                                      Project context: {review.projectName}
                                    </div>
                                  )}
                                </div>

                                <button
                                  id={`btn-delete-review-${review.id}`}
                                  onClick={() => handleDeleteReview(review.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-950/20 text-slate-550 hover:text-red-400 transition"
                                  title="Erase Verification Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                                "{review.comment}"
                              </p>
                            </div>
                          );
                        })}

                        {activeReviews.length === 0 && (
                          <div className="text-center py-10 font-mono text-[10px] text-slate-650 border border-dashed border-zinc-900 rounded-lg">
                            No verified ratings found for {activeProducer.name} yet. Click "Write Review" above to document work output.
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                );
              })()}

            </div>

          </div>
        )}

      </main>

      {/* --- Global System Status Footer --- */}
      <footer className="border-t border-zinc-900 bg-zinc-950/80 px-6 py-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            V8 Isolate Secure Connection established
          </span>
          <span className="hidden sm:inline">&bull;</span>
          <span className="hidden sm:inline">Schema Strict Validation Active (v2.0)</span>
        </div>
        <div>
          <span>RECONSTRUCT RETRIEVAL ADVISORY LAYER</span>
        </div>
      </footer>

      {/* Toast Notification for summary save confirmation */}
      <AnimatePresence>
        {toast && toast.show && (
          <motion.div
            id="export-toast-notification"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="fixed bottom-16 right-6 md:right-8 z-50 max-w-sm w-full bg-zinc-950/95 border border-[#00f5d4]/30 rounded-lg p-4 shadow-[0_0_20px_rgba(0,245,212,0.15)] backdrop-blur-md flex gap-3 text-left font-mono"
          >
            <div className="shrink-0 pt-0.5">
              <div className="bg-[#00f5d4]/10 p-1.5 rounded-full border border-[#00f5d4]/20 text-[#00f5d4]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between gap-2 leading-none">
                Vault Document Staged
              </h4>
              <p className="text-[10px] text-[#00f5d4]/90 font-bold mt-1 line-clamp-1">
                {toast.fileName}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Successfully spawned in <span className="text-slate-350 underline">01_Projects</span> directory for {toast.producerName}.
              </p>
              
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-900">
                <span className="text-[8px] text-slate-500 uppercase">Self-dismissing...</span>
                <span className="text-[8px] text-slate-500 ml-auto select-none">v2.0</span>
              </div>
            </div>

            <button
              id="toast-close-btn"
              onClick={() => setToast(null)}
              className="shrink-0 p-1 rounded hover:bg-zinc-900 text-slate-500 hover:text-white self-start transition"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
