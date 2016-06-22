import _ from 'lodash'
import React, { PropTypes } from 'react'

import BluprintConfigBuilderItem from '../BluprintConfigBuilderItem'

const propTypes = {
  flow: PropTypes.object,
  nodeSchemaMap: PropTypes.array,
  onUpdate: PropTypes.func,
  onShareDevice: PropTypes.func,
}

class BluprintConfigBuilder extends React.Component {
  constructor(props) {
    super(props)

    this.state = { configList: [] }
    this.handleUpdate = this.handleUpdate.bind(this)
  }


  onShareDevice = ({ shareDevice, nodeId }) => {
    if (shareDevice) return this.shareDevice(nodeId)
    this.dontShareDevice(nodeId)
  }


  shareDevice = (nodeId) => {
    let { configList } = this.state
    const newConfigList = _.reject(configList, { nodeId, nodeProperty: 'uuid' })
    if( _.isEqual(newConfigList, configList)) return
    this.setState({ configList: newConfigList })
  }

  dontShareDevice = (nodeId) => {
    let { configList } = this.state
    const field = _.find(configList, { nodeId, nodeProperty: 'uuid' })
    if (field) return
    configList.push({ nodeId, configProperty: 'sharedDevice', nodeProperty: 'uuid' })
    this.setState({ configList })
    return
  }

  handleUpdate(updatedConfig) {
    const { onUpdate } = this.props
    const foundConfig = _.find(this.state.configList, {
      nodeId: updatedConfig.nodeId,
      nodeProperty: updatedConfig.nodeProperty,
    })

    if (!foundConfig) {
      this.setState({ configList: [updatedConfig, ...this.state.configList] })
    } else {
      const configIndex = _.findIndex(this.state.configList, {
        nodeId: updatedConfig.nodeId,
        nodeProperty: updatedConfig.nodeProperty,
      })

      this.state.configList[configIndex] = updatedConfig
    }

    onUpdate(this.state.configList)
  }

  render() {
    const { flow, nodeSchemaMap } = this.props

    if (_.isEmpty(flow)) return null
    if (_.isEmpty(flow.nodes)) return null
    if (_.isEmpty(nodeSchemaMap)) return null

    const items = _.map(flow.nodes, (node) => {
      const nodeSchemaMapItem = _.find(nodeSchemaMap, { uuid: node.uuid })

      if (_.isEmpty(nodeSchemaMapItem)) return null

      let nodeSchema = nodeSchemaMapItem.schema
      if (nodeSchemaMapItem.category === 'device') {
        nodeSchema = nodeSchemaMapItem.schemas.message[node.selectedSchemaKey]
      }

      return (
        <BluprintConfigBuilderItem
          node={node}
          nodeSchema={nodeSchema}
          onUpdate={this.handleUpdate}
          onShareDevice={this.onShareDevice}
          key={node.id}
        />
      )
    })

    return <div>{items}</div>
  }
}

BluprintConfigBuilder.propTypes = propTypes

export default BluprintConfigBuilder
