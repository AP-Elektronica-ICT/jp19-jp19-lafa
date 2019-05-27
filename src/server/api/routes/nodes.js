const router = require('express').Router({ mergeParams: true });
const nodeSchema = require('../models/node').node;

module.exports = (db, logger) => {
  const Node = db.model('Node', nodeSchema);

  /**
   * Get all nodes
   * @returns {Node[]}
   */
  router.route('/').get((req, res) => {
    Node.find({})
      .select('-sensors -actuators -__v')
      .exec((err, nodes) => {
        res.send(nodes);
      });
  });

    /**
   * Get all data from a node
   * @param {ObjectId} nodeid
   * @returns {Node}
   */
  router.route('/:nodeid').get((req, res) => {
    Node.findById(req.params.nodeid)
      .select('-__v')
      .populate({ path: 'sensors', select: '-data -__v' })
      .populate({ path: 'actuators', select: '-__v' })
      .exec((err, node) => {
        res.send(node);
      });
  });

  /**
   * Get all the latest sensor data
   * @param {ObjectId} nodeid
   * @returns {Node}
   */
  router.route('/:nodeid/latest').get((req, res) => {
    Node.findById(req.params.nodeid)
      .select('-__v')
      .populate({
        path: 'sensors',
        select: '-__v',
        populate: {
          path: 'data',
          select: '-__v -_id',
          options: {
            limit: '1',
            sort: { time: -1 }
          }
        }
      })
      .populate({ path: 'actuators', select: '-__v' })
      .exec((err, node) => {
        res.send(node);
      });
  });

  return router;
}