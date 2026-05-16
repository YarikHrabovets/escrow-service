import { lazy, Suspense } from 'react'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import CenteredSpinner from './components/ui/CenteredSpinner'
import { HOME_ROUTE, AUTH_ROUTE, PRICING_ROUTE, FEATURES_ROUTE, DASHBOARD_ROUTE, JOBS_ROUTE } from './utils/constants'

import PublicOnlyRoute from './routes/PublicOnlyRoute'
import PrivateRoute from './routes/PrivateRoute'

const Home = lazy(() => import('./pages/Home'))
const Auth = lazy(() => import('./pages/Auth'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Features = lazy(() => import('./pages/Features'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Jobs = lazy(() => import('./pages/Jobs'))

export const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route element={<Layout />}>
                <Route path={HOME_ROUTE} element={
                    <Suspense fallback={<CenteredSpinner size="xl" />}>
                        <Home />
                    </Suspense>
                } />
                <Route path={PRICING_ROUTE} element={
                    <Suspense fallback={<CenteredSpinner size="xl" />}>
                        <Pricing />
                    </Suspense>
                } />
                <Route path={FEATURES_ROUTE} element={
                    <Suspense fallback={<CenteredSpinner size="xl" />}>
                        <Features />
                    </Suspense>
                } />
                <Route path={JOBS_ROUTE} element={
                    <Suspense fallback={<CenteredSpinner size="xl" />}>
                        <Jobs />
                    </Suspense>
                } />

                <Route element={<PrivateRoute />}>
                    <Route path={DASHBOARD_ROUTE} element={
                        <Suspense fallback={<CenteredSpinner size="xl" />}>
                            <Dashboard />
                        </Suspense>
                    } />
                </Route>
            </Route>

            <Route element={<PublicOnlyRoute />}>
                <Route path={AUTH_ROUTE} element={
                    <Suspense fallback={<CenteredSpinner size='xl' />}>
                        <Auth />
                    </Suspense>
                }/>
            </Route>
        </>
    )
)
