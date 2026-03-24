"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { useProfile, useSkillProgress, useRecentUpgrades } from "@/hooks/use-api";
import { toast } from "sonner";

export function PDFExport() {
  const { data: profile } = useProfile();
  const { data: skills } = useSkillProgress();
  const { data: upgrades } = useRecentUpgrades();

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Header with gradient-like background
      doc.setFillColor(6, 182, 212);
      doc.rect(0, 0, pageWidth, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, "bold");
      doc.text("AURISTRA'26 Upgrade", 20, 25);

      // Profile section
      yPos += 30;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Profile Summary", 20, yPos);

      yPos += 10;
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");

      if (profile) {
        doc.text(`Name: ${profile.name}`, 20, yPos);
        yPos += 7;
        doc.text(`Email: ${profile.email}`, 20, yPos);
        yPos += 7;
        doc.text(`Level: ${profile.level} | Streak: ${profile.streak} days | Challenges Completed: ${profile.challengesCompleted}`, 20, yPos);
        yPos += 7;
        doc.text(`Skills: ${profile.skills.join(", ")}`, 20, yPos, { maxWidth: pageWidth - 40 });
        yPos += 10;
      }

      // Skills Progress section
      if (skills && skills.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("Skill Progress", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        skills.forEach((skill) => {
          const progressPercent = ((skill.level / skill.target) * 100).toFixed(0);
          doc.text(`${skill.skill}: ${skill.level}/${skill.target} (${progressPercent}%)`, 20, yPos);
          yPos += 7;
        });
        yPos += 5;
      }

      // Recent Upgrades section
      if (upgrades && upgrades.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text("Recent Upgrades", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");

        upgrades.forEach((upgrade) => {
          doc.text(`${upgrade.title}`, 20, yPos);
          yPos += 5;
          doc.setFont(undefined, "italic");
          doc.text(`${upgrade.date} - Impact: ${upgrade.impact}`, 25, yPos);
          doc.setFont(undefined, "normal");
          yPos += 7;

          // Add page break if needed
          if (yPos > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
          }
        });
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
      doc.text("AURISTRA'26 Hackathon - Upgrade Dashboard", pageWidth - 20, pageHeight - 10, { align: "right" });

      // Save the PDF
      doc.save(`upgrade-progress-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Progress report downloaded!");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast.error("Failed to generate PDF report");
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 shadow-neon transition hover:bg-emerald-500/20"
    >
      <Download className="h-4 w-4" />
      Export Progress PDF
    </button>
  );
}
