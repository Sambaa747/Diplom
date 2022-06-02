import Axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ToText from '../../../utils/ToText'
import './ShowCompaign.css'
import avtar from '../../../assets/avtar.jpg'
import Spinner from '../../../Containers/Spinner/Spinner'

function ShowCompaign(props) {
  const [compaign, setCompaign] = useState(props)
  const [loading, setLoading] = useState(false)
  const [errmsg, setErrorMsg] = useState()
  const [errcode, setErrorCode] = useState()
  const history = useHistory()
  const pathname = history.location.pathname

  useEffect(() => {
    setLoading(true)
    Axios.get('/profile/bycreator/' + props.creator)
      .then((data) => {
        setLoading(false)
        setCompaign({ ...props, user: data.data.profile })
      })
      .catch((e) => {
        setLoading(false)
      })
  }, [props])

  return (
    <>
      {errcode ? (
        <div className='container error container-short'>
          <div className='mar-20'>
            <h5>Алдааны код: {errcode}</h5>
            <h4>Алдаа гарлаа - {errmsg}</h4>
          </div>
        </div>
      ) : null}

      {loading ? (
        <div className='container loading'>
          <div className='mar-20'>
            <Spinner />
          </div>
        </div>
      ) : null}
      <div className='col-md-6 col-sm-6 col-xs-12 showblog mb-3'>
        <div className='showblog_card card'>
          <div
            className='showblog_card_image'
            style={{ backgroundImage: `url(${props.imagePath})` }}
          >
            <div className='show_auth_img'>
              <Link
                to={'/public/' + compaign.user?.companyName}
                style={{
                  backgroundImage: `url(${
                    compaign.user?.imagePath ? compaign.user.imagePath : avtar
                  })`,
                }}
              >
                Sambaa
              </Link>
            </div>
          </div>
          <div className='card-body'>
            <h5 className='card-title pt-3'>
              {pathname === '/mycompaign' ? (
                <Link to={'/mycompaign/' + props._id} className='title'>
                  {props.title}
                </Link>
              ) : (
                <Link to={'/compaign/' + props._id} className='title'>
                  {props.title}
                </Link>
              )}
            </h5>

            <p className='showblog_content'>
              {`${ToText(props.title.substring(0, 80))}...`}
              <span>
                {' '}
                <b>Дэлгэрэнгүй</b>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShowCompaign
