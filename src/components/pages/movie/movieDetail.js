/**
 * Created by guangqiang on 2017/9/6.
 */
import React, {Component} from 'react'
import Swiper from 'react-native-swiper'
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
  ListView,
  Image
} from 'react-native'
import Action from '../../../actionCreators/movie'
import {commonStyle} from '../../../utils/commonStyle'
export default class MovieDetail extends Component {

  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
    this.state = {
      movieDetail: {},
      movieStory: {}
    }
  }

  componentDidMount() {
    let detailPromise = Action.movieDetail(this.props.id)
    let storyPromise = Action.movieStory(this.props.id)
    Promise.all([detailPromise, storyPromise]).then(response => {
      this.setState({
        movieDetail: response[0].data,
        movieStory: response[1].data.data
      })
    })
  }

  renderRow(rowData, rowId) {
    return (
      <View style={{borderBottomWidth: 5, borderBottomColor: commonStyle.bgColor}}>
        <View style={styles.authorInfo}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Image source={{uri: rowData.detailcover}} style={{width: 50, height: 50, borderRadius: 25, backgroundColor: commonStyle.bgColor}}/>
            <View style={{marginLeft: 10}}>
              <Text style={{padding: 5}}>{rowData.user.user_name}</Text>
              <Text style={{padding: 5}}>{rowData.input_date}</Text>
            </View>
          </View>
          <View style={{height: 50, flexDirection: 'row', alignItems: 'center'}}>
            <Image style={{width: 30, height: 30}} source={require('../../../assets/images/laud.png')}/>
            <Text>{rowData.praisenum}</Text>
          </View>
        </View>
        <View style={{margin: 10}}>
          <Text style={{marginBottom: 10, backgroundColor: commonStyle.bgColor, paddingVertical: 10}}>{rowData.title}</Text>
          <Text style={{marginBottom: 10, backgroundColor: commonStyle.bgColor, paddingVertical: 10}}>{rowData.summary}</Text>
        </View>
      </View>
    )
  }

  renderImg() {
    let picArr = this.state.movieDetail.photo || []
    let imgArr = []
    if (picArr.length) {
      for (var i = 0; i < picArr.length; i++) {
        imgArr.push(
          <Image style={styles.swipe} source={{uri: picArr[i]}} key={i}/>
        )
      }
      return imgArr
    } else {
      return (
        <Text>dada</Text>
      )
    }
  }

  renderHeader() {
    let data = this.state.movieDetail || {}
    let story = this.state.movieStory[0] || {}
    return (
      <View>
        <Swiper
          height={200}
          loop={true}
          index={0}
          autoplay={true}
        >
          {this.renderImg()}
        </Swiper>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', height: 40, alignItems: 'center', backgroundColor: commonStyle.bgColor}}>
          <Text style={{marginLeft: 10}}>{`电影故事: ${data.title}`}</Text>
          <Image style={{width: 40, height: 40}} source={require('../../../assets/images/share_image.png')}/>
        </View>
        <View style={styles.authorInfo}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Image source={{uri: data.detailcover}} style={{width: 50, height: 50, borderRadius: 25}}/>
            <View style={{marginLeft: 10}}>
              <Text style={{padding: 5}}>{data.directors}</Text>
              <Text style={{padding: 5}}>{data.maketime}</Text>
            </View>
          </View>
          <View style={{height: 50, flexDirection: 'row', alignItems: 'center'}}>
            <Image style={{width: 30, height: 30}} source={require('../../../assets/images/laud.png')}/>
            <Text>{data.read_num}</Text>
          </View>
        </View>
        <Text style={{padding: 10, fontSize: 17}}>{data.officialstory}</Text>
        <Text style={{marginHorizontal: 10, backgroundColor: commonStyle.bgColor}}>{story.content}</Text>
        <Text style={{marginLeft: 10,fontSize: 13, marginVertical: 10}}>{data.info}</Text>
        <View style={{height: 40, justifyContent:'center', backgroundColor: commonStyle.bgColor}}>
          <Text style={{marginHorizontal: 10}}>评论列表</Text>
        </View>
      </View>
    )
  }

  render() {
    let dataSource = new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}).cloneWithRows(this.state.movieStory)
    return (
      <ListView
        style={styles.listViewStyle}
        dataSource={dataSource}
        renderRow={this.renderRow}
        renderHeader={this.renderHeader}
      />
    )
  }
}

const styles = StyleSheet.create({
  listViewStyle: {
    flex: 1
  },
  swipe: {
    height: 200
  },
  authorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    marginHorizontal: 10
  }
})