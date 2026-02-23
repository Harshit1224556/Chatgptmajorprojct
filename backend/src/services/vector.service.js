const { Pinecone } = require('@pinecone-database/pinecone');
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});
const harigptindex = pc.index('harigpt');
async function creatememory({ vector, metadata, messageId }) {
  try {
    await harigptindex.upsert([
      {
        id: messageId,
        values: vector.map(Number),
        metadata,
      },
    ]);

    console.log(" Vector saved successfully");
  } catch (error) {
    console.error(" Pinecone Error:", error);
  }
}

async function querymemory({ queryvector, limit = 5, metadata }) {
  const data = await harigptindex.query({
    vector: queryvector.map(Number),
    topK: limit,
    filter: metadata || undefined,
    includeMetadata: true
  });

  return data.matches;
}
module.exports = { creatememory, querymemory };
