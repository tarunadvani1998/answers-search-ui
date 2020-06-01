/* eslint camelcase: 0 */

import ResultsHeaderComponent from 'src/ui/components/results/resultsheadercomponent';
import mockManager from '../../../setup/managermocker';
import FilterNodeFactory from '../../../../src/core/filters/filternodefactory';
import Filter from '../../../../src/core/models/filter';

describe('ResultsHeaderComponent\'s applied filters', () => {
  let resultsHeaderComponent;
  let node_f0_v0, node_f0_v1, node_f1_v0, node_f1_v1;
  const COMPONENT_MANAGER = mockManager(
    {
      getStaticFilterNodes: () => [],
      getFacetFilterNodes: () => [],
      getLocationRadiusFilterNode: () => FilterNodeFactory.from()
    },
    ResultsHeaderComponent.defaultTemplateName()
  );

  beforeEach(() => {
    resultsHeaderComponent = COMPONENT_MANAGER.create('ResultsHeader', {});
    node_f0_v0 = FilterNodeFactory.from({
      filter: Filter.equal('field0', 'value0'),
      metadata: {
        fieldName: 'name0',
        displayValue: 'display0'
      }
    });
    node_f0_v1 = FilterNodeFactory.from({
      filter: Filter.equal('field0', 'value1'),
      metadata: {
        fieldName: 'name0',
        displayValue: 'display1'
      }
    });
    node_f1_v0 = FilterNodeFactory.from({
      filter: Filter.equal('field1', 'value0'),
      metadata: {
        fieldName: 'name1',
        displayValue: 'display0'
      }
    });
    node_f1_v1 = FilterNodeFactory.from({
      filter: Filter.equal('field1', 'value1'),
      metadata: {
        fieldName: 'name1',
        displayValue: 'display1'
      }
    });
  });

  it('works for empty case', () => {
    const groupedFilters = resultsHeaderComponent.getAppliedFiltersArray([], []);
    expect(groupedFilters).toEqual([]);
  });

  it('works with simpleFilterNodes', () => {
    const simpleFilterNodes = [ node_f0_v0, node_f0_v1, node_f1_v0 ];
    const groupedFilters = resultsHeaderComponent.getAppliedFiltersArray(simpleFilterNodes);
    expect(groupedFilters).toHaveLength(2);
    expect(groupedFilters.find(f => f.label === 'name0')).toEqual({
      label: 'name0',
      displayValues: ['display0', 'display1']
    });
    expect(groupedFilters.find(f => f.label === 'name1')).toEqual({
      label: 'name1',
      displayValues: ['display0']
    });
  });

  it('duplicate disply values should still be repeated', () => {
    const simpleFilterNodes = [ node_f1_v1, node_f1_v1 ];
    const groupedFilters = resultsHeaderComponent.getAppliedFiltersArray(simpleFilterNodes);
    expect(groupedFilters).toHaveLength(1);
    expect(groupedFilters[0].label).toEqual('name1');
    expect(groupedFilters[0].displayValues).toEqual(['display1', 'display1']);
  });
});