const PouchDB = require("pouchdb");

const dbDocker = new PouchDB("http://localhost:5984/ivan-aprea", {
  auth: { username: "admin", password: "admin" },
});
const dbLocal = new PouchDB("ivan-aprea");

dbLocal
  .sync(dbDocker, {
    live: true, // mantiene conexión abierta
    retry: true, // si se cae la conexión vuelve a intentar conectarse
  })
  .on("change", (change) => {
    if (change.direction === "push") {
      console.log(`Se envio un cambio:`, change.change.docs);
    } else {
      console.log(`Se recibio un nuevo cambio: `, change.change.docs);
    }
  })
  .on("error", function (err) {
    console.log("sync error", err);
  });

const handleInsert = (data) => {
  dbLocal
    .post({ name: data })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => console.log(error));
};

const client = process.env.CLIENT;

var sendDocs = function () {
  var i = 0;
  while (i < 100) {
    (function (i) {
      setTimeout(function () {
        handleInsert(`${client} doc${i}`);
      }, 5000 * i);
    })(i++);
  }
};

dbLocal
      .allDocs({ include_docs: true })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.log(error));

sendDocs();
