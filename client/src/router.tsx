import { lazy, Suspense } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import CenteredSpinner from './components/ui/CenteredSpinner'
import { HOME_ROUTE, AUTH_ROUTE, PRICING_ROUTE, FEATURES_ROUTE } from './utils/constants'

const Home = lazy(() => import('./pages/Home'))
const Auth = lazy(() => import('./pages/Auth'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Features = lazy(() => import('./pages/Features'))

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={
                <Suspense fallback={<CenteredSpinner size='xl' />}>
                    <Layout />
                </Suspense>
            }>
                <Route path={HOME_ROUTE} element={<Home />} />
                <Route path={PRICING_ROUTE} element={<Pricing />} />
                <Route path={FEATURES_ROUTE} element={<Features />} />
            </Route>
            <Route path={AUTH_ROUTE} element={
                <Suspense fallback={<CenteredSpinner size='xl' />}>
                    <Auth />
                </Suspense>
            }/>
        </>
    )
)
