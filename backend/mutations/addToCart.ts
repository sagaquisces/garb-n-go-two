import { KeystoneContext } from "@keystone-next/types";
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';
import { CartItemCreateInput } from '../.keystone/schema-types';

async function addToCart(
  root: any, 
  { productId }: { productId: string }, 
  context: KeystoneContext
) : Promise<CartItemCreateInput> {
  console.log('ADDING TO CART')
  // 1. Query current user and see if signed in.
  const sesh = context.session as Session
  if(!sesh.itemId) {
    throw new Error('You must be logged in to do this.')
  }
  // 2. Query cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId }},
    resolveFields: 'id,quantity'
  })
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(`This item is already ${existingCartItem.quantity} in the cart, increment by one`);
    // 3. See if item is in cart and increment by one
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
      resolveFields: false
    })
  }
  // 4. otherwise, create new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: {
        connect: {
          id: productId
        }
      },
      user: {
        connect: {
          id: sesh.itemId
        }
      }
    },
    resolveFields: false,
  })
}

export default addToCart;