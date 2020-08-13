/*
 * @Author: Tmier
 * @Date: 2020-08-13 10:12:57
 * @LastEditTime: 2020-08-13 14:21:18
 * @Description: 
 */
module.exports = {
    title: `Tmier's Blog`,
    description: 'Just playing around',
    configureWebpack: {
        resolve: {
            alias: {
                '@assets': './assets'
            }
        }
    },
    themeConfig: {
        logo: '/images/logo.gif',
        sidebarDepth: 2,
        displayAllHeaders: true,
        nav: [{
                text: 'Home',
                link: '/'
            },
            {
                text: 'Vue',
                link: '/vue/'
            },
            {
                text: 'JS',
                link: '/js/'
            },
            {
                text: 'CSS',
                link: '/css/'
            },
            {
                text: '语雀',
                link: 'https://www.yuque.com/tmier/blog'
            },
            {
                text: 'Github',
                link: 'https://github.com/itmier'
            },
            // {
            //     text: '语言',
            //     ariaLabel: 'Language Menu',
            //     items: [{
            //             text: 'Chinese',
            //             link: '/language/chinese/'
            //         },
            //         {
            //             text: 'Japanese',
            //             link: '/language/japanese/'
            //         }
            //     ]
            // }
        ],
        sidebar: 'auto',
        lastUpdated: 'Last Updated', // string | boolean
        // sidebar: [
        //     {
        //         title: 'Vue',
        //         path: '/vue/',
        //         sidebarDepth: 1,
        //         initialOpenGroupIndex: -1,
        //         children: [
        //             '/vue/'
        //         ]
        //     },
        //     {
        //         title: 'JS',
        //         path: '/js/',
        //         sidebarDepth: 1,
        //         children: [
        //             '/js/'
        //         ]
        //     },
        //     {
        //         title: 'CSS',
        //         path: '/css/',
        //         sidebarDepth: 1,
        //         children: [
        //             '/css/'
        //         ]
        //     }
        // ]

    }
}