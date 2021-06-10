import { CartItem } from '../schemas/CartItem'
import { User } from './../schemas/User';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import { KeystoneContext } from "@keystone-next/types";
import stripeConfig from '../lib/stripe';

const graphql = String.raw;
interface Arguments {
  token: string
}
async function checkout(
  root: any, 
  { token }: Arguments, 
  context: KeystoneContext
) : Promise<OrderCreateInput> {
  // signed in?
  const userId = context.session.itemId;
  if(!userId) {
    throw new Error('Sorry. You must be logged in to create an order.')
  }
  // Query the current user
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          id
          name
          price
          description
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }
    `
  })
  console.dir(user, { depth: null })
  // calculate total price
  const cartItems = user.cart.filter(cartItem => cartItem.product)
  const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput) {
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0)
  console.log(amount);
  console.log("TOKEN")
  console.log(token)
  // create charge with stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'USD',
    confirm: true,
    payment_method: token,
  }).catch(err => {
    console.log(err);
    throw new Error(err.message)
  })

  console.log(charge);
  // convert cart items to order items
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id }},
    }
    return orderItem;
  })
  // create order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems },
      user: { connect: { id: userId }}
    },
    resolveFields: false,
  })
  // clean up
  const cartItemIdsToDelete = user.cart.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIdsToDelete,
  });
  return order;
}

export default checkout;