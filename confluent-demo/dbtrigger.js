exports = async function(changeEvent) {
  let collection = context.services.get("Cluster0").db("datameta").collection("processedMessage");
  let document = changeEvent.fullDocument;
  let r = Math.round(Math.random()*256).toString(16).padStart(2, "0");
  let g = Math.round(Math.random()*256).toString(16).padStart(2, "0");
  let b = Math.round(Math.random()*256).toString(16).padStart(2, "0");
  let color = `${r}${g}${b}`;
  document.color = color;
  let result = await collection.insertOne(document);
  console.log(result);
  return result;
}