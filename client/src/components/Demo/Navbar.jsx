import "./bootstrap.min.css";
function Navbar() {
    return (
        <nav id="mainNav" className="navbar navbar-light navbar-expand-md sticky-top navbar-shrink py-3">
            <div className="container">
                <div id="navcol-1" className="collapse navbar-collapse">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                            <img className="bi bi-bezier" src = "logo192.png" width="50"/>
                </a><button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item"><a className="nav-link active" href="index.html"><img src="logo_soloTesto.png" width="200"  /></a></li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;