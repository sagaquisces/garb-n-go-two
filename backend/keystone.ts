import { config, createSchema } from '@keystone-next/keystone/schema'
import { createAuth } from '@keystone-next/auth'
import { User } from './schemas/User';
import 'dotenv/config'
import {
    withItemData, statelessSessions
} from '@keystone-next/keystone/session'

const databaseURL = process.env.DATABASEURL || 'mongodb://localhost/keystone-garb-n-go'

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
    }
})

export default withAuth(config({
    server: {
        cors: {
            origin: [process.env.FRONTEND_URL],
            credentials: true,
        }
    },
    db: {
        adapter: 'mongoose',
        url: databaseURL,
        // TODO: Add data seeding here
    },
    lists: createSchema({
        User,
    }),
    ui: {
        // Show ui for people who pass test
        isAccessAllowed: ({ session }) => {
            return !!session?.data
        },
    },
    session: withItemData(statelessSessions(sessionConfig), {
        User: `id`
    })
}))