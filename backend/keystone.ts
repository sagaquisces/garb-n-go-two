import { Role } from './schemas/Roles';
import { Order } from './schemas/Order';
import { OrderItem } from './schemas/OrderItem';
import { extendGraphqlSchema } from './mutations/index';
import { CartItem } from './schemas/CartItem';
import { ProductImage } from './schemas/ProductImage';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { config, createSchema } from '@keystone-next/keystone/schema'
import { createAuth } from '@keystone-next/auth'
import 'dotenv/config'
import {
    withItemData, statelessSessions
} from '@keystone-next/keystone/session'
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { permissionsList } from './schemas/fields';

const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost/keystone-garb-n-go'

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long signed in?
    secret: process.env.COOKIE_SECRET,
}

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password']
        // TODO: Add in initial roles
    },
    passwordResetLink: {
        async sendToken(args) {
            // send the email
            await sendPasswordResetEmail(args.token, args.identity)
        }
    }
})

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        },
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        async onConnect(keystone) {
            console.log("Connected to the db.")
            if(process.argv.includes('--seed-data'))
            await insertSeedData(keystone);
        }
    },
    lists: createSchema({
        User,
        Product,
        ProductImage,
        CartItem,
        Order,
        OrderItem,
        Role,
    }),
    extendGraphqlSchema,
    ui: {
        // Show ui for people who pass test
        isAccessAllowed: ({ session }) => {
            return !!session?.data
        },
    },
    session: withItemData(statelessSessions(sessionConfig), {
        User: `id name email role{ ${permissionsList.join(' ')} }`
    })
}))