import React from "react";
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
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

// 1. CONFIGURE YOUR CONNECTION
const connector = new AppSearchAPIConnector({
  searchKey: "YOUR_PUBLIC_SEARCH_KEY", // Note: Use the 'Search-Only' key here, not the Private one!
  engineName: "medical-records",
  endpointBase: "YOUR_ENDPOINT_URL"
});

const config = {
  alwaysSearchOnInitialLoad: true,
  apiConnector: connector,
  hasA11yNotifications: true,
  searchQuery: {
    result_fields: {
      patient_name: { snippet: {} },
      diagnosis: { raw: {} },
      notes: { snippet: { size: 100, fallback: true } }
    }
  }
};

export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={<SearchBox debounceLength={0} />}
                  sideContent={
                    <div>
                      <Sorting
                        label={"Sort by"}
                        sortOptions={[
                          { name: "Relevance", value: "", direction: "" },
                          { name: "Name", value: "patient_name", direction: "asc" }
                        ]}
                      />
                      <Facet
                        field="diagnosis"
                        label="Diagnosis"
                        filterType="any"
                        isFilterable={true}
                      />
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField="patient_name"
                      urlField="id"
                      shouldTrackClickThrough={true}
                      resultView={({ result }: any) => (
                        <li className="sui-result" style={{ listStyle: "none", borderBottom: "1px solid #eee", padding: "10px 0" }}>
                          <div className="sui-result__header">
                            {/* Patient Name with Hit Highlighting */}
                            <h3 dangerouslySetInnerHTML={{ __html: result.patient_name.snippet }} />
                          </div>
                          <div className="sui-result__body">
                            <p><strong>Diagnosis:</strong> {result.diagnosis.raw}</p>
                            {/* Doctor Notes with Hit Highlighting */}
                            <p dangerouslySetInnerHTML={{ __html: result.notes.snippet }} />
                          </div>
                        </li>
                      )}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}