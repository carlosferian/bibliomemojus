const { createFilePath } = require("gatsby-source-filesystem")

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  if (node.internal.type === "MarkdownRemark") {
    const parent = getNode(node.parent)
    createNodeField({ node, name: "collection", value: parent.sourceInstanceName })
    createNodeField({ node, name: "slug", value: createFilePath({ node, getNode }) })
  }
}
