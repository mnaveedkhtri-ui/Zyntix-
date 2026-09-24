function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    var keyword = data.keyword || "Strategic Entity";
    var targetUrl = data.targetUrl || "https://example.com";
    var previousUrl = data.previousUrl || null;
    var currentYear = new Date().getFullYear();
    var dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

    var htmlContent = "<body style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;\">" +
      "<div style=\"border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;\">" +
        "<h1 style=\"color: #1e3a8a; font-size: 28px; margin-bottom: 5px; text-transform: capitalize;\">" + keyword + "</h1>" +
        "<h2 style=\"color: #3b82f6; font-size: 20px; margin-top: 0; font-weight: 400;\">Comprehensive " + currentYear + " Industry Report & Strategic Analysis</h2>" +
        "<p style=\"color: #64748b; font-size: 14px; font-style: italic;\">Published: " + dateStr + " | Verified Cloud Asset</p>" +
      "</div>" +
      "<h2 style=\"color: #0f172a; font-size: 22px; border-left: 4px solid #3b82f6; padding-left: 10px;\">1. Executive Overview & Market Context</h2>" +
      "<p>In the rapidly evolving digital landscape of " + currentYear + ", the significance of <strong>" + keyword + "</strong> cannot be overstated. This comprehensive document serves as an authoritative cloud entity, designed to establish semantic relevance, provide verifiable data points, and outline the core architectural frameworks required for optimal implementation.</p>" +
      "<h2 style=\"color: #0f172a; font-size: 22px; border-left: 4px solid #10b981; padding-left: 10px; margin-top: 30px;\">2. Core Methodologies & Implementation Strategies</h2>" +
      "<p>To maximize the efficacy of operations related to " + keyword + ", industry leaders recommend adopting the following strategic pillars:</p>" +
      "<ul style=\"background-color: #f8fafc; padding: 20px 20px 20px 40px; border-radius: 8px; border: 1px solid #e2e8f0;\">" +
        "<li style=\"margin-bottom: 10px;\"><strong>Data-Driven Acquisition:</strong> Utilizing real-time analytics to identify high-yield opportunities and optimize resource allocation.</li>" +
        "<li style=\"margin-bottom: 10px;\"><strong>Semantic Optimization:</strong> Structuring data and content to align with advanced machine learning algorithms and search engine protocols.</li>" +
        "<li style=\"margin-bottom: 10px;\"><strong>Authority Syndication:</strong> Building robust, interconnected cloud networks (Entity Stacking) to distribute trust signals securely.</li>" +
        "<li><strong>Risk Mitigation:</strong> Implementing dynamic fail-safes and compliance checks to maintain integrity across all digital assets.</li>" +
      "</ul>" +
      "<h2 style=\"color: #0f172a; font-size: 22px; border-left: 4px solid #f59e0b; padding-left: 10px; margin-top: 30px;\">3. Key Performance Indicators (KPIs)</h2>" +
      "<table style=\"width: 100%; border-collapse: collapse; margin-top: 15px; border: 1px solid #cbd5e1;\">" +
        "<thead>" +
          "<tr style=\"background-color: #f1f5f9;\">" +
            "<th style=\"padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; color: #334155;\">Metric / Indicator</th>" +
            "<th style=\"padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; color: #334155;\">Impact Factor</th>" +
            "<th style=\"padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1; color: #334155;\">Industry Benchmark</th>" +
          "</tr>" +
        "</thead>" +
        "<tbody>" +
          "<tr>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0;\">Network Authority Transfer</td>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;\">High</td>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0;\">99.9% Efficiency</td>" +
          "</tr>" +
          "<tr>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0;\">Semantic Relevance Score</td>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0; color: #16a34a; font-weight: bold;\">Critical</td>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0;\">Tier-1 Alignment</td>" +
          "</tr>" +
          "<tr>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0;\">Indexation Velocity</td>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0; color: #eab308; font-weight: bold;\">Medium</td>" +
            "<td style=\"padding: 12px; border-bottom: 1px solid #e2e8f0;\">24 - 48 Hours</td>" +
          "</tr>" +
        "</tbody>" +
      "</table>" +
      "<h2 style=\"color: #0f172a; font-size: 22px; border-left: 4px solid #8b5cf6; padding-left: 10px; margin-top: 30px;\">4. Verified Resource Links & Entity Network</h2>" +
      "<p>To access official services, proprietary tools, or to schedule a professional consultation regarding <strong>" + keyword + "</strong>, please utilize the verified primary resource link below:</p>" +
      "<div style=\"text-align: center; margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 12px; border: 1px dashed #cbd5e1;\">" +
        "<a href=\"" + targetUrl + "\" style=\"display: inline-block; background-color: #2563eb; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);\">Explore Official Services: " + keyword + "</a>";

    if (previousUrl) {
      htmlContent += "<br><br><p style=\"margin: 15px 0 5px 0; color: #64748b; font-size: 14px;\">Network Connection:</p>" +
        "<a href=\"" + previousUrl + "\" style=\"display: inline-block; background-color: #f1f5f9; color: #334155; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; border: 1px solid #cbd5e1;\">?? Access Previous Entity Node</a>";
    }
    
    htmlContent += "</div>" +
      "<h2 style=\"color: #0f172a; font-size: 22px; border-left: 4px solid #ec4899; padding-left: 10px; margin-top: 30px;\">5. Frequently Asked Questions (FAQ)</h2>" +
      "<div style=\"margin-bottom: 15px;\">" +
        "<h3 style=\"color: #1e293b; font-size: 16px; margin-bottom: 5px;\">Q1: Why is " + keyword + " considered essential in " + currentYear + "?</h3>" +
        "<p style=\"margin-top: 0; color: #475569;\">A: It forms the foundational blueprint for establishing digital authority and ensuring scalable growth in a highly competitive market.</p>" +
      "</div>" +
      "<div style=\"margin-bottom: 15px;\">" +
        "<h3 style=\"color: #1e293b; font-size: 16px; margin-bottom: 5px;\">Q2: How is the quality and integrity of this data verified?</h3>" +
        "<p style=\"margin-top: 0; color: #475569;\">A: All data points and strategic recommendations are cross-referenced with industry-leading benchmarks and vetted by senior analysts.</p>" +
      "</div>" +
      "<hr style=\"border: 0; border-top: 1px solid #e2e8f0; margin-top: 40px;\">" +
      "<p style=\"text-align: center; color: #94a3b8; font-size: 12px;\">© " + currentYear + " Zyntix Cloud Network. This document was algorithmically generated for entity stacking purposes. All rights reserved.</p>" +
      "</body>";

    const blob = Utilities.newBlob(htmlContent, MimeType.HTML, keyword);
    
    // Updated for Drive API v3
    const newFile = Drive.Files.create(
      { name: keyword, mimeType: MimeType.GOOGLE_DOCS },
      blob
    );
    const docFile = DriveApp.getFileById(newFile.id);
    docFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      url: docFile.getUrl()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
