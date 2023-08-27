import React, {useEffect, useState} from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

const News= (props)=> {
const [articles, setArticles] = useState([])
const [loading, setLoading] = useState(true)
const [page, setPage] = useState(1)
const [totalResult, setTotalResults] = useState(0)


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }    

  const updateNews = async ()=> {
    props.setProgress(20);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=77027f1e0313473eac42ef2eef75004c&page=${page}&pageSize= ${props.pageSize}`

    setLoading(true)

    let data = await fetch(url);
    props.setProgress(50);
    let parseData = await data.json()
    props.setProgress(75);
    setArticles(parseData.articles)
    setTotalResults(parseData.totalResults)
    setLoading(false)

    props.setProgress(100);
  }

useEffect(() => {
  document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`
  // setPage(page+1)
  updateNews();
}, [])
 

  const fetchMoreData = async () => {
    // setPage(page+1)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=77027f1e0313473eac42ef2eef75004c&page=${page+1}&pageSize= ${props.pageSize}`
    setPage(page+1)

    let data = await fetch(url);
    let parseData = await data.json()
    setArticles(articles.concat(parseData.articles))
    setTotalResults(parseData.totalResults)
  };


    return (
      <>
        <h1 className='text-center' style={{ margin: "70px 0px 15px" }}> NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines </h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResult}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title ? element.title : ""}
                      description={element.description ? element.description : ""}
                      imageurl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}

                    />
                  </div>
                )
              })}

            </div>
          </div>
        </InfiniteScroll>



      </>
    )
  }


News.defaultProps = {
  country: "in",
  pageSize: 9,
  category: "general"
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News
