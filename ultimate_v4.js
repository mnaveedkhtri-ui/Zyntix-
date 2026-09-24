function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    var keyword = data.keyword || "Strategic Entity";
    var targetUrl = data.targetUrl || "https://example.com";
    var previousUrl = data.previousUrl || null;
    
    // New Flags from Zyntix Dashboard
    var generateDocs = data.generateDocs !== false; // default true
    var generateSlides = data.generateSlides === true;
    var generateForms = data.generateForms === true;

    var currentYear = new Date().getFullYear();
    var dateStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    
    var responseUrls = {};

    // ============ 1. GOOGLE DOC ============
    if (generateDocs) {
      var htmlContent = "<body style=\"font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;\">" +
        "<div style=\"border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;\">" +
          "<h1 style=\"color: #1e3a8a; font-size: 28px;\">" + keyword + "</h1>" +
          "<h2 style=\"color: #3b82f6; font-size: 20px; font-weight: 400;\">Comprehensive " + currentYear + " Industry Report</h2>" +
          "<p style=\"color: #64748b; font-size: 14px;\">Published: " + dateStr + " | Verified Cloud Asset</p>" +
        "</div>" +
        "<h2 style=\"color: #0f172a; border-left: 4px solid #3b82f6; padding-left: 10px;\">1. Executive Overview</h2>" +
        "<p>In the rapidly evolving digital landscape of " + currentYear + ", the significance of <strong>" + keyword + "</strong> cannot be overstated. This document serves as an authoritative cloud entity establishing semantic relevance and verifiable data points.</p>" +
        "<h2 style=\"color: #0f172a; border-left: 4px solid #10b981; padding-left: 10px; margin-top: 30px;\">2. Core Methodologies</h2>" +
        "<ul style=\"background:#f8fafc; padding: 20px 20px 20px 40px; border-radius: 8px; border: 1px solid #e2e8f0;\">" +
          "<li style=\"margin-bottom:10px\"><strong>Data-Driven Acquisition:</strong> Utilizing real-time analytics to identify high-yield opportunities.</li>" +
          "<li style=\"margin-bottom:10px\"><strong>Semantic Optimization:</strong> Structuring data to align with advanced machine learning algorithms.</li>" +
          "<li style=\"margin-bottom:10px\"><strong>Authority Syndication:</strong> Building interconnected cloud networks for trust signal distribution.</li>" +
          "<li><strong>Risk Mitigation:</strong> Implementing dynamic fail-safes to maintain digital asset integrity.</li>" +
        "</ul>" +
        "<h2 style=\"color: #0f172a; border-left: 4px solid #f59e0b; padding-left: 10px; margin-top: 30px;\">3. Key Performance Indicators</h2>" +
        "<table style=\"width:100%; border-collapse:collapse; border: 1px solid #cbd5e1;\">" +
          "<thead><tr style=\"background:#f1f5f9\">" +
            "<th style=\"padding:12px; text-align:left; border-bottom: 2px solid #cbd5e1;\">Metric</th>" +
            "<th style=\"padding:12px; text-align:left; border-bottom: 2px solid #cbd5e1;\">Impact</th>" +
            "<th style=\"padding:12px; text-align:left; border-bottom: 2px solid #cbd5e1;\">Benchmark</th>" +
          "</tr></thead>" +
          "<tbody>" +
            "<tr><td style=\"padding:12px; border-bottom: 1px solid #e2e8f0;\">Network Authority Transfer</td><td style=\"padding:12px; border-bottom: 1px solid #e2e8f0; color:#16a34a; font-weight:bold;\">High</td><td style=\"padding:12px; border-bottom: 1px solid #e2e8f0;\">99.9% Efficiency</td></tr>" +
            "<tr><td style=\"padding:12px; border-bottom: 1px solid #e2e8f0;\">Semantic Relevance Score</td><td style=\"padding:12px; border-bottom: 1px solid #e2e8f0; color:#16a34a; font-weight:bold;\">Critical</td><td style=\"padding:12px; border-bottom: 1px solid #e2e8f0;\">Tier-1 Alignment</td></tr>" +
            "<tr><td style=\"padding:12px;\">Indexation Velocity</td><td style=\"padding:12px; color:#eab308; font-weight:bold;\">Medium</td><td style=\"padding:12px;\">24-48 Hours</td></tr>" +
          "</tbody>" +
        "</table>" +
        "<h2 style=\"color: #0f172a; border-left: 4px solid #8b5cf6; padding-left: 10px; margin-top: 30px;\">4. Official Resource Links</h2>" +
        "<div style=\"text-align:center; margin:30px 0; padding:20px; background:#f8fafc; border-radius:12px; border: 1px dashed #cbd5e1;\">" +
          "<a href=\"" + targetUrl + "\" style=\"display:inline-block; background:#2563eb; color:white; padding:16px 32px; text-decoration:none; border-radius:8px; font-weight:bold; font-size:18px;\">Explore Official Services: " + keyword + "</a>";

      if (previousUrl) {
        htmlContent += "<br><br><a href=\"" + previousUrl + "\" style=\"display:inline-block; background:#f1f5f9; color:#334155; padding:10px 20px; text-decoration:none; border-radius:6px; font-weight:600; font-size:14px; border:1px solid #cbd5e1;\">?? Access Previous Entity Node</a>";
      }

      htmlContent += "</div>" +
        "<h2 style=\"color: #0f172a; border-left: 4px solid #ec4899; padding-left: 10px; margin-top: 30px;\">5. Frequently Asked Questions</h2>" +
        "<div style=\"margin-bottom:15px\"><h3>Q1: Why is " + keyword + " essential in " + currentYear + "?</h3><p style=\"color:#475569\">A: It forms the foundational blueprint for digital authority and scalable growth.</p></div>" +
        "<div style=\"margin-bottom:15px\"><h3>Q2: How is this data verified?</h3><p style=\"color:#475569\">A: Cross-referenced with industry benchmarks and vetted by senior analysts.</p></div>" +
        "<div style=\"margin-bottom:15px\"><h3>Q3: What are the primary advantages?</h3><p style=\"color:#475569\">A: Enhanced visibility, robust digital footprints, and higher engagement metrics.</p></div>" +
        "<div style=\"margin-bottom:15px\"><h3>Q4: Are there long-term maintenance requirements?</h3><p style=\"color:#475569\">A: Periodic audits recommended to maintain optimal performance against evolving algorithms.</p></div>" +
        "<div style=\"margin-bottom:15px\"><h3>Q5: How does this interact with existing digital assets?</h3><p style=\"color:#475569\">A: Operates as a complementary network layer, passing authority seamlessly without disrupting core website architecture.</p></div>" +
        "<hr style=\"border:0; border-top:1px solid #e2e8f0; margin-top:40px\">" +
        "<p style=\"text-align:center; color:#94a3b8; font-size:12px\">© " + currentYear + " Zyntix Cloud Network. Algorithmically generated for entity stacking.</p>" +
        "</body>";

      const docBlob = Utilities.newBlob(htmlContent, MimeType.HTML, keyword);
      const docFile = Drive.Files.create({ name: keyword + " - Industry Report", mimeType: MimeType.GOOGLE_DOCS }, docBlob);
      const docObj = DriveApp.getFileById(docFile.id);
      docObj.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      responseUrls.doc = docObj.getUrl();
    }

    // ============ 2. GOOGLE SLIDES ============
    if (generateSlides) {
      var presentation = SlidesApp.create(keyword + " - Strategic Overview " + currentYear);
      var slide1 = presentation.getSlides()[0];
      slide1.getPageElements().forEach(function(el) { el.remove(); });
      
      var titleBox = slide1.insertTextBox(keyword);
      titleBox.setLeft(50); titleBox.setTop(80); titleBox.setWidth(620); titleBox.setHeight(80);
      titleBox.getText().getTextStyle().setFontSize(36).setBold(true).setForegroundColor("#1e3a8a");

      var subBox = slide1.insertTextBox("Comprehensive " + currentYear + " Industry Report | Verified Cloud Asset");
      subBox.setLeft(50); subBox.setTop(170); subBox.setWidth(620); subBox.setHeight(40);
      subBox.getText().getTextStyle().setFontSize(16).setForegroundColor("#3b82f6");

      var slide2 = presentation.appendSlide();
      var bodyBox = slide2.insertTextBox(
        "Key Benefits of " + keyword + "\n\n" +
        "? Data-Driven Acquisition: Identify high-yield opportunities\n" +
        "? Semantic Optimization: Align with search engine algorithms\n" +
        "? Authority Syndication: Build DA-100 entity networks\n" +
        "? Risk Mitigation: Maintain digital asset integrity\n\n"
      );
      bodyBox.setLeft(50); bodyBox.setTop(50); bodyBox.setWidth(620); bodyBox.setHeight(400);
      bodyBox.getText().getTextStyle().setFontSize(16);

      // Hyperlink injection for REAL link equity!
      var linkText = bodyBox.getText().appendText("?? Explore Official Services");
      linkText.getTextStyle().setLinkUrl(targetUrl).setForegroundColor("#2563eb").setUnderline(true);

      var slidesFile = DriveApp.getFileById(presentation.getId());
      slidesFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      responseUrls.slides = slidesFile.getUrl();
    }

    // ============ 3. GOOGLE FORM ============
    if (generateForms) {
      var form = FormApp.create(keyword + " - Professional Consultation " + currentYear);
      form.setDescription(
        "Official consultation form for " + keyword + ".\n\n" +
        "This form helps us understand your specific requirements and match you with the best " + keyword + " professionals.\n\n" +
        "Official Website: " + targetUrl
      );
      form.addTextItem().setTitle("Your Full Name").setRequired(true);
      form.addTextItem().setTitle("Email Address").setRequired(true);
      form.addTextItem().setTitle("Website URL").setRequired(false);
      form.addMultipleChoiceItem().setTitle("What is your primary goal with " + keyword + "?")
        .setChoiceValues(["Improve Rankings", "Build Authority", "Generate Leads", "Brand Awareness"]);
      form.addParagraphTextItem().setTitle("Describe your specific requirements");
      
      var formFile = DriveApp.getFileById(form.getId());
      formFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      responseUrls.form = form.getPublishedUrl();
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      urls: responseUrls
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
