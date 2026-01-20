import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
// Import our custom CSS file
import "./App.css";

// 1. CONFIGURE YOUR CONNECTION
// connecting to Elastic Cloud instance using environment variables
const connector = new AppSearchAPIConnector({
  searchKey: import.meta.env.VITE_ELASTIC_SEARCH_KEY,
  engineName: "medical-records",
  endpointBase: import.meta.env.VITE_ELASTIC_ENDPOINT
});

// Configuration for the SearchProvider
const config = {
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    result_fields: {
      patient_name: { snippet: {} },
      diagnosis: { raw: {} },
      notes: { snippet: { size: 100, fallback: true } },
      id: { raw: {} }
    },
    // We can add facets (filters) configuration here if we want them to return specific counts
    facets: {
      diagnosis: { type: "value", size: 20 }
    }
  }
};

export default function App() {
  return (
    // SearchProvider: The core component that holds the search state (results, query, filters, etc.)
    // and exposes it to all children components. It connects to Elastic App Search using the 'config'.
    <SearchProvider config={config}>

      {/* WithSearch: A standard High Order Component (HOC) or Render Prop pattern 
          that lets us access the search state variables (wasSearched, results, etc.)
          and actions (setSearchTerm, addFilter, etc.) manually. */}
      <WithSearch mapContextToProps={({ wasSearched, filters, clearFilters }) => ({ wasSearched, filters, clearFilters })}>
        {({ wasSearched, filters, clearFilters }) => {
          return (
            <div className="App page-background">
              {/* ErrorBoundary helps catch errors in the search UI without crashing the whole app */}
              <ErrorBoundary>

                {/* Header with Search Box */}
                <header className="header">
                  <h1 className="header-title">MediSearch Dashboard</h1>
                  <div style={{ width: "400px" }}>
                    <SearchBox
                      searchAsYouType={true}
                      debounceLength={300}
                      inputProps={{ placeholder: "Search patient name, diagnosis, or notes..." }}
                    />
                  </div>
                </header>

                <div className="container">

                  {/* LEFT COLUMN: FACETS (FILTERS) */}
                  <aside className="sidebar">
                    <h2 className="sidebar-title">Filters</h2>

                    {/* Facet: Renders a list of checkboxes or links to filter results by a specific field. 
                            Here we filter by 'diagnosis'. */}
                    <div className="mb-4">
                      <Facet
                        field="diagnosis"
                        label="Diagnosis Category"
                        filterType="any"
                        isFilterable={true}
                      />
                    </div>

                    {/* Custom "Clear Filters" Button */}
                    {filters && filters.length > 0 && (
                      <button className="clear-button" onClick={() => clearFilters && clearFilters()}>
                        Clear All Filters
                      </button>
                    )}
                  </aside>

                  {/* RIGHT COLUMN: RESULTS */}
                  <main className="main-content">

                    <div className="results-header">
                      {/* PagingInfo: Shows "Showing 1 - 10 of 23 results" */}
                      {wasSearched && <PagingInfo />}

                      {/* Sorting: Dropdown to sort results */}
                      <Sorting
                        label={"Sort by"}
                        sortOptions={[
                          { name: "Relevance", value: "", direction: "" },
                          { name: "Patient Name (A-Z)", value: "patient_name", direction: "asc" },
                          { name: "Patient Name (Z-A)", value: "patient_name", direction: "desc" }
                        ]}
                      />
                    </div>

                    {/* ResultsPerPage: Select how many results to show (20, 40, 60) */}
                    <div className="results-per-page-container">
                      <ResultsPerPage />
                    </div>

                    {/* Results: The list of items returned by the search. 
                            We provide a custom 'resultView' to style each item as a patient card. */}
                    <Results
                      titleField="patient_name"
                      urlField="id"
                      shouldTrackClickThrough={true}
                      resultView={({ result, onClickLink }: any) => (
                        <li className="patient-card">
                          {/* Patient Name with Title styling */}
                          <h3 className="patient-name">
                            {/* dangerouslySetInnerHTML is used because 'snippet' contains HTML highlight tags like <em> */}
                            <a onClick={onClickLink} href="#" className="patient-name-link" dangerouslySetInnerHTML={{ __html: result.patient_name.snippet }} />
                          </h3>

                          {/* Badge for Diagnosis */}
                          <span className="diagnosis-label">{result.diagnosis.raw}</span>

                          {/* Doctor Notes Preview */}
                          <div className="notes-section">
                            <strong>Notes: </strong>
                            <span dangerouslySetInnerHTML={{ __html: result.notes.snippet }} />
                          </div>
                        </li>
                      )}
                    />

                    {/* Paging: Pagination controls (Previous ... 1 2 3 ... Next) */}
                    <div className="paging-container">
                      <Paging />
                    </div>

                  </main>

                </div>
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}