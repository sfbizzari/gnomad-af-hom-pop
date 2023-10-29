---
question: 'Why are two variants predicted as occurring on the same haplotype when the majority of the samples in gnomAD only have a single variant?'
---

The variant co-occurrence tool assesses the probability of whether we would observe the given allele counts for each rare variant if the two rare variants were present on different haplotypes. For the two variants in question, the probability that the two variants are on different haplotypes is very low (<1%), which is why the co-occurrence prediction is that these variants occur on the same haplotype.

Note that due to the rare allele frequency of these two variants, it is more likely to see samples that fall within the "Samples consistent with variants appearing in isolation or on different haplotypes" column – there aren't that many samples that have both rare variants. Note also that probability values for our variant co-occurrence tool are not well calibrated, particularly where both variants are extremely rare. Please see our [preprint](https://www.biorxiv.org/content/10.1101/2023.03.19.533370) or [blog post on variant co-occurrence](https://gnomad.broadinstitute.org/news/2021-07-variant-co-occurrence-phasing-information-in-gnomad/) for accuracy estimates and additional detail.

In samples with both rare variants, it is only possible to count the sample in the "Samples consistent with variants appearing on the same haplotype" column when at least one of the variants is homozygous in the sample – this is indicated in the "Genotype Counts" table below the overview table (genotypes: aaBb, Aabb, and aabb). All samples that are heterozygous for both variants (genotype: AaBb) fall into "Samples consistent with either co-occurrence pattern" as phase is unknown from the sequencing data (the variants could either be AB|ab or Ab|aB in configuration) -- the EM algorithm is then used to obtain estimated haplotype frequencies given the missing values for the double heterozygote.

Finally, the likelihood that the variants are on different haplotypes is calculated from the estimated haplotype counts as: (Ab×aB)/((AB×ab)+(Ab×aB)) -- this simply represents the probability of inheriting both the Ab and aB haplotypes, which in this case is very low (<1%).