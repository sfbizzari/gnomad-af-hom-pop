import PropTypes from 'prop-types'
import React from 'react'

import { CoverageTrack } from '@broad/track-coverage'

import { coverageDataset } from '../coverage'
import { referenceGenomeForDataset } from '../datasets'
import { coverageConfigClassic, coverageConfigNew } from '../coverageStyles'
import Query from '../Query'
import StatusMessage from '../StatusMessage'

const getCoverageQuery = ({ includeExomeCoverage = true, includeGenomeCoverage = true } = {}) => {
  return `
query GeneCoverage($geneId: String!, $datasetId: DatasetId!, $referenceGenome: ReferenceGenomeId!) {
  gene(gene_id: $geneId, reference_genome: $referenceGenome) {
    ${
      includeExomeCoverage
        ? `exome_coverage(dataset: $datasetId) {
      pos
      mean
      median
      over_1
      over_5
      over_10
      over_15
      over_20
      over_25
      over_30
      over_50
      over_100
    }`
        : ''
    }
    ${
      includeGenomeCoverage
        ? `genome_coverage(dataset: $datasetId) {
      pos
      mean
      median
      over_1
      over_5
      over_10
      over_15
      over_20
      over_25
      over_30
      over_50
      over_100
    }`
        : ''
    }
  }
}
`
}

const GeneCoverageTrack = ({ datasetId, geneId, includeExomeCoverage, includeGenomeCoverage }) => {
  return (
    <Query
      query={getCoverageQuery({ includeExomeCoverage, includeGenomeCoverage })}
      variables={{
        geneId,
        datasetId: coverageDataset(datasetId),
        referenceGenome: referenceGenomeForDataset(coverageDataset(datasetId)),
      }}
    >
      {({ data, error, loading }) => {
        if (loading) {
          return <StatusMessage>Loading coverage...</StatusMessage>
        }
        if (error) {
          return <StatusMessage>Unable to load coverage</StatusMessage>
        }

        const exomeCoverage = includeExomeCoverage ? data.gene.exome_coverage : null
        const genomeCoverage = includeGenomeCoverage ? data.gene.genome_coverage : null

        if (!exomeCoverage && !genomeCoverage) {
          return <StatusMessage>Unable to load coverage</StatusMessage>
        }

        const coverageConfig =
          datasetId === 'exac'
            ? coverageConfigClassic(exomeCoverage, genomeCoverage)
            : coverageConfigNew(exomeCoverage, genomeCoverage)

        return (
          <CoverageTrack
            datasets={coverageConfig}
            filenameForExport={() => `${geneId}_coverage`}
            height={190}
          />
        )
      }}
    </Query>
  )
}

GeneCoverageTrack.propTypes = {
  datasetId: PropTypes.string.isRequired,
  geneId: PropTypes.string.isRequired,
  includeExomeCoverage: PropTypes.bool,
  includeGenomeCoverage: PropTypes.bool,
}

GeneCoverageTrack.defaultProps = {
  includeExomeCoverage: true,
  includeGenomeCoverage: true,
}

export default GeneCoverageTrack
