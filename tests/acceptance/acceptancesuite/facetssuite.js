import { setupServer, shutdownServer } from '../server';
import VerticalPage from '../pageobjects/verticalpage';

fixture`Facets page`
  .before(setupServer)
  .after(shutdownServer)
  .page`http://localhost:9999/tests/acceptance/fixtures/html/facets`;

test(`Facets load on the page, and can affect the search`, async t => {
  const searchComponent = VerticalPage.getSearchComponent();
  await searchComponent.submitQuery();

  const facets = VerticalPage.getFacetsComponent();
  const filterBox = facets.getFilterBox();

  // Record the amount of results with no facets
  const verticalResultsComponent = VerticalPage.getVerticalResultsComponent();
  const initialResultsCount = await verticalResultsComponent.getResultsCountTotal();

  // Select the first option in the first FilterOptions
  const employeeDepartment = await filterBox.getFilterOptionsWithTitle('Employee Department');
  await employeeDepartment.toggleOption('Client Delivery [SO]');
  let expectedResultsCount = await employeeDepartment.getOptionCount('Client Delivery [SO]');

  await filterBox.applyFilters();

  // Get the actual number of results and check that it equals the expected amount
  let actualResultsCount = await verticalResultsComponent.getResultsCountTotal();
  await t.expect(actualResultsCount).eql(expectedResultsCount);

  // Reset the filters, and check that the number of results
  // is the same as the initial amount
  await filterBox.reset();
  await filterBox.applyFilters();
  actualResultsCount = await verticalResultsComponent.getResultsCountTotal();
  await t.expect(actualResultsCount).eql(initialResultsCount);

  // Select the first option and second option in the first FilterOptions
  await employeeDepartment.toggleOption('Client Delivery [SO]');
  await employeeDepartment.toggleOption('Technology');
  const clientDeliveryCount = await employeeDepartment.getOptionCount('Client Delivery [SO]');
  const technologyCount = await employeeDepartment.getOptionCount('Technology');
  expectedResultsCount = clientDeliveryCount + technologyCount;
  await filterBox.applyFilters();
  actualResultsCount = await verticalResultsComponent.getResultsCountTotal();
  await t.expect(actualResultsCount).eql(expectedResultsCount);

  // Check that selecting multiple FilterOptions works
  const brands = await filterBox.getFilterOptionsWithTitle('Brands');
  await brands.toggleOption('E');
  expectedResultsCount = await brands.getOptionCount('E');
  await filterBox.applyFilters();
  actualResultsCount = await verticalResultsComponent.getResultsCountTotal();
  await t.expect(actualResultsCount).eql(expectedResultsCount);

  // Reset the filters, and check that the number of results
  // is the same as the initial amount
  await filterBox.reset();
  await filterBox.applyFilters();
  actualResultsCount = await verticalResultsComponent.getResultsCountTotal();
  await t.expect(actualResultsCount).eql(initialResultsCount);
});
