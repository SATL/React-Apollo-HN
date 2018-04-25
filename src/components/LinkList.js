import React, { Component } from 'react'
import Link from './Link'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class LinkList extends Component {
  render() {
    const linksToRender = [
      {
        id: '1',
        description: 'Prisma turns your database into a GraphQL API 😎 😎',
        url: 'https://www.prismagraphql.com',
      },
      {
        id: '2',
        description: 'The best GraphQL client',
        url: 'https://www.apollographql.com/docs/react/',
      },
    ]

    const query = this.props.feedQuery;

    if(query){
        if(query.loading)
            return <div>Loading</div>
        else if(query.error)
            return <div>Error</div>

        const links = query.feed.links;


        return(
            <div>{links.map( (link,index) => <Link updateStoreAfterVote={this._updateCacheAfterVote} key={link.id} index={index} link={link}/>)}</div>
        )
    }

    return (
      <div>Error !query</div>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY })
  
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
  
    store.writeQuery({ query: FEED_QUERY, data })
  }
}

export const FEED_QUERY = gql`
    query FeedQuery{
        feed{
            links{
                id
                createdAt,
                url,
                description
                postedBy{
                    id
                    name
                }
                votes{
                    id
                    user{
                        id
                    }
                }
            }
        }
    }
`

export default graphql(FEED_QUERY, {name:'feedQuery'}) (LinkList);