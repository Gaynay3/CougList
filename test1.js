const sequelize = require('./db');
const Listing = require('./models/listings');
const Conversation = require('./models/conversations');
const Message = require('./models/messages');

//change after user model 
let User;
try {
  User = require('./models/user');
} catch (err) {
  console.warn(" No User model found");
}

async function test() {
  try {
    await sequelize.sync({ force: true });

    let user1Id = 1;
    let user2Id = 2;

    if (User) {
      const user1 = await User.create({ username: 'SellerName' });
      const user2 = await User.create({ username: 'Buyer' });
      user1Id = user1.id;
      user2Id = user2.id;
    }

    await Listing.bulkCreate([
  {
    title: 'Mini Fridge',
    description: 'Used one semester, works well. Fits easily in dorm rooms.',
    price: 35,
    location: 'Pullman',
    image: ['minifridge1.jpeg','minifridge2.jpeg'],
    category: 'Kitchen & Dining',
    condition: 'Used',
    delivery: 'Pickup Only',
    dimensions: '1.6 - 1.7 cu. ft.'
  },
  {
    title: 'Red Couch',
    description: 'Comfy red couch, minor wear. Pickup in Moscow.',
    price: 45,
    location: 'Moscow',
    image: ['couch1.jpeg','couch2.jpeg'],
    category: 'Furniture'
  },
  {
    title: 'Math Textbook',
    description: 'Calculus textbook, good condition. Covers multivariable.',
    price: 28,
    location: 'Pullman',
    image: 'textbook.jpg',
    category: 'Books'
  },
  {
    title: 'iPad Pro M2 11"',
    description: 'Almost new iPad Pro 11" with M2 chip. Great for school!',
    price: 325,
    location: 'Pullman',
    image: 'ipad.jpg',
    category: 'Electronics'
  },
  {
    title: 'Toaster Oven',
    description: 'Works perfectly. Can toast, bake, and broil.',
    price: 42,
    location: 'Pullman',
    image: ['toasterOven1.jpeg','toasterOven2.jpeg'],
    category: 'Kitchen & Dining'
  },
  {
    title: 'Desk lamp',
    description: 'LED desk lamp with adjustable neck and brightness.',
    price: 25,
    location: 'Pullman',
    image: 'deskLamp1.jpeg',
    category: 'Electronics'
  }
]);

const listing = await Listing.findOne();
    
    //conversation
    const conversation = await Conversation.create({
      user1Id,
      user2Id,
      listingId: listing.id
    });

    // message - buyer
    const message = await Message.create({
      conversationId: conversation.id,
      senderId: user1Id,
      content: 'Hey is this still available?'
    });

    //message - seller
      await Message.create({
      conversationId: conversation.id,
      senderId: user2Id,
      content: "Yes this is still available"
    });


    console.log('test complete!');
    console.table({
      listingId: listing.id,
      conversationId: conversation.id,
      messageId: message.id,
      senderId: message.senderId
    });

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await sequelize.close();
  }
}

test();
