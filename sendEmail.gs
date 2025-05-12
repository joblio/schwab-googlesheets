function emailJoelError() {
  const link = 'https://docs.google.com/spreadsheets/d/1ehPmrizxan_v1Tgto1cj8zSfbJL6SDBxKgqy6Z2mxiA/'
  const subject = 'Schwab Positions Update Failed';
  // formattedJson = JSON.stringify(json,null,2);
  // let attachments = [];

  const date = Utilities.formatDate(new Date(), Session.getTimeZone(), "d MMM 'at' h:mm:ss a");

  let text = '<p>The <a href="'+link+'">Schwab Positions spreadsheet</a> updated failed on '+date+'. Probably because it needs to be reauthorized.</p>';
  // console.log(text);
  MailApp.sendEmail('joblio@gmail.com', subject,"",{htmlBody: text});
  return;
  }