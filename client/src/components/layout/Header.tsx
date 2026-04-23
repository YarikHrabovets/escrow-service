function Header() {
    return (
        <header className="navbar bg-base-100 px-10 sticky top-0 z-50 backdrop-blur">
            <div className="flex-1">
                <span className="text-xl font-bold text-primary">SecureEscrow</span>
            </div>
            <div className="flex-none space-x-6">
                <a className="link link-hover">Features</a>
                <a className="link link-hover">Pricing</a>
                <a className="link link-hover">Login</a>
            </div>
        </header>
    )
}

export default Header
