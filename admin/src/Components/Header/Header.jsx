import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const navigate = useNavigate();
  const [sidetoggle, setSideToggle] = useState(false)
  const [efresh, setRefresh] = useState(false)

  const handletoggleBtn = () => {
    setSideToggle(!sidetoggle)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('login');
    window.location.href = '/login'
    // navigate('/login')
  };
  return (
    <>
      <header>
        <div className="top-head">
          <div className="right">
            <Link className='text-white text-decoration-none' to="/"><h2>Manovaidya Admin Panel</h2></Link>
            <div className="bar" onClick={handletoggleBtn}>
              <i class="fa-solid fa-bars"></i>
            </div>
          </div>
          <div className="left">
            <a href="https://manovedya.vercel.app/" target="_blank">
              <i class="fa-solid fa-globe"></i>
              Go To Website
            </a>

            <div className="logout" onClick={handleLogout}>
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </div>
          </div>
        </div>
        <div className={`rightNav ${sidetoggle ? "active" : ""} `}>
          <ul>
            <li><Link to="/" onClick={handletoggleBtn}> <i class="fa-solid fa-gauge"></i> Dashboard</Link></li>
            <li><Link to="/all-banners" onClick={handletoggleBtn}> <i class="fa-regular fa-images"></i> Manage Banners</Link></li>
            {/* <li><Link to="/about" onClick={handletoggleBtn}> <i class="fa-solid fa-gauge"></i> Manage About</Link></li> */}
            {/* <li><Link to="/update-about" onClick={handletoggleBtn}> <i class="fa-solid fa-gauge"></i> Manage About</Link></li> */}

            <li><Link to="/all-products" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> All Products</Link></li>
            <li><Link to="/All-Herbs-For-Natural" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> All Herbs For Natural</Link></li>
            <li><Link to="/all-dieses" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Manage Dieses</Link></li>
            <li><Link to="/all-blogs" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> All Blogs</Link></li>
            <li><Link to="/mind-health-test" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Mind Health Test</Link></li>
            {/* <li><Link to="/add-test" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Add Mind Health Test</Link></li> */}
            <li><Link to="/view-test" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Add Mind Health Test</Link></li>
            <li><Link to="/news-letter" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> News Letter</Link></li>
            <li><Link to="/patient-details" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Consult Patient Details</Link></li>
            <li><Link to="/all-coupen" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Manage Coupens</Link></li>
            <li><Link to="/sub-diseases" onClick={handletoggleBtn}> <i class="fa-solid fa-tags"></i> Sub Diseases</Link></li>
            <li><Link to="/all-orders" onClick={handletoggleBtn}> <i class="fa-solid fa-truck"></i> Manage Orders</Link></li>


            {/* 
            <li><Link to="/all-contact-query" onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Contact Query</Link></li>
            <li><Link to="/all-subcategory" onClick={handletoggleBtn}> <i class="fa-solid fa-tag"></i> Manage Sub Category</Link></li>
            <li><Link to="/all-products" onClick={handletoggleBtn}> <i class="fa-solid fa-boxes-stacked"></i> Manage Product</Link></li>
            <li><Link to="/all-color" onClick={handletoggleBtn}> <i class="fa-solid fa-palette"></i> Manage Color</Link></li>
            <li><Link to="/all-size" onClick={handletoggleBtn}> <i class="fa-solid fa-ruler-combined"></i> Manage Size</Link></li>
            <li><Link to="/all-flower" onClick={handletoggleBtn}> <i class="fa-solid fa-seedling"></i> Manage Flover</Link></li>
            <li><Link to="/all-tags" onClick={handletoggleBtn}> <i class="fa-solid fa-tag"></i> Manage Tags</Link></li>
            <li><Link to="/all-users" onClick={handletoggleBtn}> <i class="fa-solid fa-users"></i> All Users</Link></li> */}

            <div className="logout" onClick={handleLogout}>
              Log Out <i className="fa-solid fa-right-from-bracket"></i>
            </div>

          </ul>
        </div>

      </header>
    </>
  )
}

export default Header