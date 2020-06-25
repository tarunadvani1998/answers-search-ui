import SearchComponentBlock from '../blocks/searchcomponent';
import VerticalResultsComponentBlock from '../blocks/verticalresultscomponent';
import PaginationComponentBlock from '../blocks/paginationcomponent';
import FacetsComponentBlock from '../blocks/facetscomponent';

/**
 * A model of a vertical search page, containing block representations
 * of the various {@link Component}s a user would interact with.
 */
class VerticalPage {
  constructor () {
    this._searchComponent = new SearchComponentBlock();
    this._verticalResultsComponent = new VerticalResultsComponentBlock();
    this._paginationComponent = new PaginationComponentBlock();
    this._facetsComponent = new FacetsComponentBlock();
  }

  /**
     * Returns the {@link SearchComponentBlock} on the page.
     */
  getSearchComponent () {
    return this._searchComponent;
  }

  /**
     * Returns the {@link VerticalResultsComponentBlock} on the page.
     */
  getVerticalResultsComponent () {
    return this._verticalResultsComponent;
  }

  /**
   * Returns the {@link PaginationComponentBlock} on the page.
   */
  getPaginationComponent () {
    return this._paginationComponent;
  }

  /**
   * Returns the {@link FacetsComponentBlock} on the page.
   */
  getFacetsComponent () {
    return this._facetsComponent;
  }
}

export default new VerticalPage();
