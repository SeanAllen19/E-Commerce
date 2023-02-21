const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const getAllTags = await Tag.findAll({
        include:[
          {model: Product, through: ProductTag}
        ]
    })
    res.status(200).json(getAllTags)
  } catch (err){
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const singleId = await Tag.findByPk(req.params.id, {
      include: [
        { model: Product, through: ProductTag }
      ]
    })
    res.status(200).json(singleId)

  } catch (err) {
    res.status(500).json(err)
  }

});

router.post('/', (req, res) => {

  Tag.create(req.body)
  .then((tag) => {
    if(req.body.productIds.length) {
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: tag.id,
          product_id 
        };
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
  })
  .then((alltagIds) => res.status(200).json(alltagIds)) 
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
  
});


router.put('/:id',async (req, res) => {
  try {
    //updates a tag
    await Tag.update(req.body, {
      where: { id: req.params.id }
    });
    res.status(200).json();
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      }
    })
    res.status(200).json(deleteTag)
  } 
  catch(err) {
    res.status(500).json(err)
  }
});
module.exports = router;
