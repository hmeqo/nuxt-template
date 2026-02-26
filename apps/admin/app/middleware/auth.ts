export default defineNuxtRouteMiddleware(() => routeAuth([{ auth: [IsAuthenticated] }], { fallback: '/login' }))
