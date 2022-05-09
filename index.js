class SocialNetworkQueries {
  
  constructor({ fetchCurrentUser }) {
    this.fetchCurrentUser = fetchCurrentUser
  }
  
  async findPotentialLikes ({ minimalScore } = {}) {
    
    try {
      
      const data = await this.fetchCurrentUser()
      const userBookMap = {}
      const potentialLikes = {}
      
      
      const likedBooks = data.likes.books
      likedBooks.forEach(book => userBookMap[book] = true)
      
      
      
      const friends = data.friends
      if (!friends) {
        return Promise.resolve({ books: [] })
      }
      
      const friendList = friends.length
      const minFriend = friendList * minimalScore
      
      friends.forEach(friend => {
        const friendLikedBooks = friend.likes.books
        friendLikedBooks.forEach(book => {
          if (!userBookMap[book]) {
            if (potentialLikes[book]) {
              potentialLikes[book] = potentialLikes[book] + 1
            } else {
              potentialLikes[book] = 1
            }
          }
        })
      })
      
      
      const potentialLikesList = []
      for (const key in potentialLikes) {
        if (potentialLikes.hasOwnProperty(key) && potentialLikes[key] >= minFriend) {
          potentialLikesList.push({ book: key, likes: potentialLikes[key] })
        }
      }
      potentialLikesList.sort((a, b) => {
        if (b['likes'] === a['likes']) {
          return a['book'] > b['book'] ? 1 : -1
        }
        
        return b['likes'] - a['likes']
      })
      
      
      const resultPotentialLikes = potentialLikesList.reduce((acc, curr) => {
        acc.push(curr.book)
        return acc
      }, [])
      
      return Promise.resolve({ books: resultPotentialLikes })
      
    } catch (e) {
      return Promise.resolve({ books: [] })
    }
  }
}

export { SocialNetworkQueries }
