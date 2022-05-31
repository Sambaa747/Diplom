import React from 'react'
import './footer.css'

function footer() {
  return (
    <>
      <div className='aaa'>
        <footer className=' fadeInUp col-md-12 '>
          <a
            href='https://medium.com/@mehulkothari05/medium-blogs-on-your-react-app-a3898a729aad'
            className='button btn-light medium'
          >
            <span>
              <img
                className='img-circle'
                width='20'
                alt=''
                src='https://seeklogo.com/images/M/medium-logo-93CDCF6451-seeklogo.com.png'
              />
              dwadwadawdad
            </span>
          </a>
        </footer>
        <h5 className='text-center copyright'>
          {' '}
          © 2022. Санхүү Эдийн Засгийн Их Сургууль. МСМТ, С.Самбалхүндэв
        </h5>
      </div>
    </>
  )
}
export default footer
