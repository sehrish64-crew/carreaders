import { AiAnalysisResponse, AiIssue } from "@/types";

const FAKE_ISSUE_TEMPLATES = [
  { type: "Dent", title: "Dent detected", minCost: 300, maxCost: 700 },
  { type: "Scratch", title: "Scratch detected", minCost: 200, maxCost: 550 },
  { type: "Rust", title: "Rust detected", minCost: 350, maxCost: 900 },
  { type: "Paint damage", title: "Paint damage detected", minCost: 250, maxCost: 650 },
];

function hashStringToNumber(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pseudoRandom(value: number, range: number, offset = 0) {
  const normalized = Math.abs(Math.sin(value + 1) * 10000);
  return offset + Math.floor((normalized - Math.floor(normalized)) * range);
}

function pseudoRandomFloat(value: number, min: number, max: number) {
  const normalized = Math.abs(Math.sin(value + 2) * 10000);
  return min + (normalized - Math.floor(normalized)) * (max - min);
}

function getSeverity(confidence: number): "low" | "medium" | "high" | "critical" {
  if (confidence >= 92) return "high";
  if (confidence >= 80) return "medium";
  return "low";
}

function formatRepairEstimate(minCost: number, maxCost: number, confidence: number) {
  const multiplier = 0.8 + (confidence / 100) * 0.4;
  const low = Math.round(minCost * multiplier);
  const high = Math.round(maxCost * (0.95 + (confidence / 100) * 0.25));
  return `£${low} - £${high}`;
}

function buildFakeIssue(template: { type: string; title: string; minCost: number; maxCost: number }, seed: number, imageIdx: number, issueIdx: number): AiIssue {
  const confidence = Math.round(pseudoRandomFloat(seed + issueIdx * 7, 60, 95));
  const severity = getSeverity(confidence);

  return {
    id: `${template.type.toLowerCase().replace(/\s+/g, "-")}-${imageIdx}-${issueIdx}`,
    title: template.title,
    severity,
    confidence,
    repairEstimate: formatRepairEstimate(template.minCost, template.maxCost, confidence),
    riskLevel: severity === "high" ? "high" : severity === "medium" ? "medium" : "low",
    description: `Premium fallback analysis detected ${template.title.toLowerCase()} with ${confidence}% confidence.`,
    hidden: true,
  };
}

function generateFakeIssuesForImage(imageUrl: string, imageIdx: number) {
  const baseSeed = hashStringToNumber(imageUrl || `fallback-${imageIdx}`);
  const issueCount = 1 + pseudoRandom(baseSeed, 3);
  const selected = new Set<number>();
  const issues: AiIssue[] = [];

  for (let issueIdx = 0; issueIdx < issueCount; issueIdx += 1) {
    const typeIndex = pseudoRandom(baseSeed + issueIdx * 11, FAKE_ISSUE_TEMPLATES.length);
    if (selected.has(typeIndex)) {
      continue;
    }
    selected.add(typeIndex);
    issues.push(buildFakeIssue(FAKE_ISSUE_TEMPLATES[typeIndex], baseSeed + issueIdx * 13, imageIdx, issueIdx));
  }

  if (issues.length === 0) {
    issues.push(buildFakeIssue(FAKE_ISSUE_TEMPLATES[baseSeed % FAKE_ISSUE_TEMPLATES.length], baseSeed, imageIdx, 0));
  }

  return issues;
}

export async function runAiAnalysis(imageUrls: string[]): Promise<AiAnalysisResponse> {
  const issues = imageUrls.flatMap((imageUrl, imageIdx) => generateFakeIssuesForImage(imageUrl, imageIdx));

  const score = Math.max(
    40,
    100 -
      issues.reduce((total, issue) => {
        return total + (issue.severity === "high" ? 14 : issue.severity === "medium" ? 9 : 5);
      }, 0),
  );

  const summary = `Premium fallback AI detected ${issues.length} issue${issues.length !== 1 ? "s" : ""} across ${imageUrls.length} image${imageUrls.length !== 1 ? "s" : ""}.`;

  return {
    score,
    issues,
    rawPredictions: [],
    conditionScore: score,
    riskLevel: score <= 60 ? "high" : score <= 80 ? "medium" : "low",
    summary,
  };
}
