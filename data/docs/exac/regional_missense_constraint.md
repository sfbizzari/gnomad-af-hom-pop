# ExAC regional missense constraint

1. Create a Dataproc cluster.

   ```shell
   hailctl dataproc start data-load \
      --max-idle 30m \
      --packages "elasticsearch~=5.5"
   ```

2. Prepare the data for the browser. Replace `$EXAC_REGIONAL_MISSENSE_CONSTRAINT_BROWSER_HT_URL`
   with the location to store the Hail table.

   ```shell
   hailctl dataproc submit data-load \
      ./data/exac/prepare_exac_regional_missense_constraint.py \
         --regional-missense-constraint fordist_constraint_official_regional_missense_cleaned_metrics_nosynoutliers.txt \
         --output $EXAC_REGIONAL_MISSENSE_CONSTRAINT_BROWSER_HT_URL
   ```

3. Load the Hail table into Elasticsearch. Use the `$EXAC_REGIONAL_MISSENSE_CONSTRAINT_BROWSER_HT_URL`
   from step 2 and replace `$ELASTICSEARCH_IP` with the IP address of your Elasticsearch server.

   ```shell
   hailctl dataproc submit data-load \
      --pyfiles ./data/data_utils \
      ./data/export_hail_table_to_elasticsearch.py \
         $EXAC_REGIONAL_MISSENSE_CONSTRAINT_BROWSER_HT_URL \
         $ELASTICSEARCH_IP \
         exac_regional_missense_constraint \
         --id-field transcript_id \
         --num-shards 2 \
         --set-type regions=object \
         --disable-field regions

   ```

4. Delete the Dataproc cluster

   ```shell
   hailctl dataproc stop data-load
   ```