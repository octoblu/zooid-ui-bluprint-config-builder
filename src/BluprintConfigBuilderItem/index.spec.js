import _ from 'lodash';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import React from 'react';
import sinon from 'sinon';
import { mount, shallow } from 'enzyme';
import ReactJsonSchemaForm from 'react-jsonschema-form';

import BluprintConfigBuilderItem from './';
import NodeMapField from '../NodeMapField';

import sampleFlow from '../../test/data/sample-flow.json';


chai.use(chaiEnzyme());

describe('<BluprintConfigBuilderItem />', () => {
  it('should render nothing when node prop is empty', () => {
    const sut = shallow(<BluprintConfigBuilderItem />);
    expect(sut).to.be.empty;
  });

  it('should render nothing when given a node that is an empty object', () => {
    const sut = shallow(<BluprintConfigBuilderItem node={{}} />);
    expect(sut).to.be.empty;
  });

  describe('when given valid node & nodeSchema', () => {
    let nodeSchema, node, sut, onUpdate;

    beforeEach(() => {
      nodeSchema = {
        'title': 'Trigger',
        'type': 'object',
        'properties': {
          'alias': {
            'type': 'string',
            'title': 'Alias',
          },
          'payloadType': {
            'type': 'string',
            'title': 'Payload Type',
            'enum': [
              'date',
              'none',
              'string',
            ],
          },
          'payload': {
            'type': 'string',
            'title': 'Payload',
          },
        },
      };
      node = sampleFlow.nodes[0];
      onUpdate = sinon.spy();
      sut = shallow(
        <BluprintConfigBuilderItem
          node={node}
          nodeSchema={nodeSchema}
          onUpdate={onUpdate}
        />
      );
    });

    it('should render NodeMapFields for each property', () => {

      expect(sut).to.contain(<NodeMapField nodeId={node.id} nodeProperty="alias" onUpdate={onUpdate} />);
      expect(sut).to.contain(<NodeMapField nodeId={node.id} nodeProperty="payload" onUpdate={onUpdate} />);
      expect(sut).to.contain(<NodeMapField nodeId={node.id} nodeProperty="payloadType" onUpdate={onUpdate} />);
    });

  });
});
