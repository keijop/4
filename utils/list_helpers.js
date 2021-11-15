const dummy = blogs => 1

const totalLikes = (blogs) => {
  return blogs.reduce( (sum, current) => sum + current.likes, 0)
}


const favouriteBlog = (blogs) => {

  if(blogs.length === 0) return 'Can\'t produce result of empty array'

  const maxLikesPost = blogs.reduce( (most, current) => {
    return most.likes < current.likes ? current : most
  }, blogs[0])

  const { url, __v, _id, ...result } = maxLikesPost
  return result
}


const mostBlogs = (blogs) => {

  if(blogs.length === 0) return 'Can\'t produce result of empty array'

  //returns {author name : blog count}
  const countObj = blogs.reduce( (count, current) => {
    count[current.author] ? count[current.author]++ : count[current.author] = 1
    return count
  }, {})

  //sort countObj entries in descending order => most blogs first
  let arr = Object.entries(countObj)
  arr.sort( (a, b) => a[1] > b[1] ? -1 : 1)

  return { author : arr[0][0], blogs : arr[0][1] }

}


const mostLikes = (blogs) => {

  if(blogs.length === 0) return 'Can\'t produce result of empty array'

  const countObj = blogs.reduce( (count, current) => {
    count[current.author]
      ? count[current.author] += current.likes //if auth exists add likes to existing likes
      : count[current.author] = current.likes //if auth does not exist, add key : value -> auth : likes
    return count
  }, {})

  //sort countObj entries in descending order => most likes first
  let arr = Object.entries(countObj)
  arr.sort( (a, b) => a[1] > b[1] ? -1 : 1)

  return { author : arr[0][0], likes : arr[0][1] }

}




module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes }