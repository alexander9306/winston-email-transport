const Transport = require('winston-transport');
const nodemailer = require('nodemailer');


module.exports = class EmailTransport extends Transport {
  constructor(opts) {
    super(opts);

    this.from = opts.from;
    this.to = opts.to;
    this.subject = opts.subject;
    this.text = opts.text;
    this.html = opts.html;

    this.transporter = nodemailer.createTransport({
      host: opts.host,
      port: opts.port,
      secure: opts.secure, // true for 465, false for other ports
      auth: {
        user: opts.user, // generated ethereal user
        pass: opts.pass, // generated ethereal password
      },
    });
    //
    // Consume any custom options here. e.g.:
    // - Connection information for databases
    // - Authentication information for APIs (e.g. loggly, papertrail,
    //   logentries, etc.).
    //
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Perform the writing to the remote service
    this.transporter.sendMail({
      from: this.from,
      to: this.to,
      subject: this.subject || `winston [${info.level}]`,
      text: info.message,
      html: `<p>${info.message}<p>`,
    }, function(err, response){ console.log(err) })


    callback();
  }
};
