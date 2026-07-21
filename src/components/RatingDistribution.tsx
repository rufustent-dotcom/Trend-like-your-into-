import React, { useEffect, useRef } from "react";
import { select, scaleBand, scaleLinear, easeCubicOut } from "d3";
import { ProducerReview } from "../types";

interface RatingDistributionProps {
  reviews: ProducerReview[];
}

export default function RatingDistribution({ reviews = [] }: RatingDistributionProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Compute 5-star down to 1-star distributions
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = (reviews || []).filter(r => r && r.rating === star).length;
    const percentage = reviews && reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove(); // Purge old elements for reference freshness

    const width = 160;
    const height = 80;
    const margin = { top: 4, right: 28, bottom: 4, left: 24 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Band scale mapping star ratings: ["5", "4", "3", "2", "1"]
    const yScale = scaleBand()
      .domain(["5", "4", "3", "2", "1"])
      .range([0, chartHeight])
      .padding(0.25);

    // Linear scale mapping percentage: [0, 100]
    const xScale = scaleLinear()
      .domain([0, 100])
      .range([0, chartWidth]);

    const rows = g.selectAll(".rating-row")
      .data(distribution)
      .enter()
      .append("g")
      .attr("class", "rating-row")
      .attr("transform", d => `translate(0, ${yScale(String(d.star)) || 0})`);

    // 1. Level labels (e.g. "5★")
    rows.append("text")
      .attr("id", (d) => `rating-label-${d.star}`)
      .attr("x", -6)
      .attr("y", (yScale.bandwidth() / 2) + 3.5)
      .attr("text-anchor", "end")
      .attr("fill", d => d.count > 0 ? "#ffffff" : "#71717a") // White if count > 0, zinc-500 otherwise
      .style("font-family", "JetBrains Mono, SFMono-Regular, monospace")
      .style("font-size", "8.5px")
      .style("font-weight", "600")
      .text(d => `${d.star}★`);

    // 2. Background Track Rects (Full width path)
    rows.append("rect")
      .attr("id", (d) => `rating-track-${d.star}`)
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", chartWidth)
      .attr("height", yScale.bandwidth())
      .attr("rx", 1.5)
      .attr("ry", 1.5)
      .attr("fill", "#09090b"); // zinc-950 tracker path

    // 3. Foreground filled bar with animated entry transition
    rows.append("rect")
      .attr("id", (d) => `rating-bar-${d.star}`)
      .attr("class", "bar-fill")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", yScale.bandwidth())
      .attr("rx", 1.5)
      .attr("ry", 1.5)
      .attr("fill", d => d.count > 0 ? "#00f5d4" : "#27272a") // Turquoise accent for reviews, dark zinc for empty
      .attr("width", 0)
      .transition()
      .duration(700)
      .ease(easeCubicOut)
      .attr("width", d => xScale(d.percentage));

    // 4. Count Labels on the right side
    rows.append("text")
      .attr("id", (d) => `rating-count-${d.star}`)
      .attr("x", chartWidth + 6)
      .attr("y", (yScale.bandwidth() / 2) + 3.5)
      .attr("text-anchor", "start")
      .attr("fill", d => d.count > 0 ? "#00f5d4" : "#52525b") // Turquoise highlighted counts
      .style("font-family", "JetBrains Mono, SFMono-Regular, monospace")
      .style("font-size", "8.5px")
      .style("font-weight", d => d.count > 0 ? "700" : "500")
      .text(d => d.count);

  }, [reviews, distribution]);

  return (
    <div className="w-full flex justify-center items-center select-none" id="rating-distribution-svg-container">
      <svg
        ref={svgRef}
        viewBox="0 0 160 80"
        className="w-full h-auto max-w-[180px]"
        id="rating-distribution-svg"
      />
    </div>
  );
}
