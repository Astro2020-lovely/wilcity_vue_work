import VueRouter from 'vue-router'
Vue.use(VueRouter);

const WilDashboardHome = () => import ('./../components/smart/Dashboard/Routes/WilDashboardHome.vue');
const WilDashboardEvents = () => import ('./../components/smart/Dashboard/Routes/WilDashboardEvents.vue');
const WilDashboardListings = () => import ('./../components/smart/Dashboard/Routes/WilDashboardListings.vue');
const WilDashboardMessages = () => import ('./../components/smart/Dashboard/Routes/WilDashboardMessages.vue');
const WilNotifications = () => import ('./../components/smart/Dashboard/Routes/WilNotifications.vue');
const WilProfile = () => import ('./../components/smart/Dashboard/Routes/WilProfile.vue');
const WilDashboardFavorites = () => import ('./../components/smart/Dashboard/Routes/WilDashboardFavorites.vue');
const WilDashboardReviews = () => import ('./../components/smart/Dashboard/Routes/WilDashboardReviews.vue');
const WilDashboardBillings = () => import ('./../components/smart/Dashboard/Routes/WilDashboardBillings.vue');
// const PrintArea = () => import ('./../components/smart/Dashboard/Routes/Billings/PrintArea.vue');
const BillingDetails = () => import ('./../components/smart/Dashboard/Routes/Billings/BillingDetails.vue');
const WilBillingsInvoiceDetails = () => import ('./../components/smart/Dashboard/Routes/Billings/WilBillingsInvoiceDetails.vue');
const WilBillingsPricings = () => import ('./../components/smart/Dashboard/Routes/Billings/WilBillingsPricings.vue');
const WilDashboardPromotionDetails = () => import ('./../components/smart/Dashboard/Routes/WilDashboardPromotionDetails.vue');

const routes = [
    {
        path: '/events',
        name: 'events',
        component: WilDashboardEvents
    },
    {
        path: '/listings/:postType',
        name: 'listings',
        component: WilDashboardListings
    },
    {
        path: 'promotions/:id',
        name: 'promotiondetails',
        component: WilDashboardPromotionDetails
    },
    {
        path: '/messages',
        component: WilDashboardMessages,
        name: 'messages',
        query: {
            u: '',
            id: ''
        }
    }, {
        path: '/reviews',
        component: WilDashboardReviews,
        name: 'reviews'
    }, {
        path: '/notifications',
        name: 'notifications',
        component: WilNotifications
    }, {
        path: '/get-profile',
        name: 'get-profile',
        component: WilProfile
    }, {
        path: '/favorites',
        name: 'favorites',
        component: WilDashboardFavorites
    }, {
        path: '/billings',
        name: 'billings',
        component: WilDashboardBillings,
        children: [
            {
                path: 'invoices/:id',
                name: 'invoicedetails',
                component: WilBillingsInvoiceDetails
            }, {
                path: 'change-plan/:type',
                component: WilBillingsPricings,
                name: 'pricings',
                query: {
                    currentPlan: ''
                }
            }, {
                path: 'details/:id',
                component: BillingDetails,
                name: 'billingdetails',
                query: {}
            }
        ]
    }, {
        path: '/dokan',
        name: 'dokan',
        beforeEnter: to => {
            window.location.href = to.query.redirectTo;
        }
    }, {
        path: '*',
        name: 'dashboard',
        component: WilDashboardHome,
        beforeEnter: (to, from, next) => {
            if (to.query && !_.isEmpty(to.query.redirectTo)) {
                window.location.href = to.query.redirectTo;
                return true;
            }

            if (!WILOKE_INLINE_GLOBAL.userRole || WILOKE_INLINE_GLOBAL.userRole === 'subscriber') {
                next('/get-profile');
            }
            next();
        }
    }
];

if (typeof WILOKE_INLINE_GLOBAL.oDashboardExternalLinks !== 'undefined' && WILOKE_INLINE_GLOBAL.oDashboardExternalLinks !== null) {
    for (let path in WILOKE_INLINE_GLOBAL.oDashboardExternalLinks) {
        routes.push({
            path: '/' + path,
            beforeEnter: to => {
                window.location.href = to.query.redirectTo;
            }
        });
    }
}

export const dashboardRouter = new VueRouter({
    reusable: false, routes // short for `routes: routes`
});
