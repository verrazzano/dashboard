<script>
// Added by Verrazzano
import WeblogicWorkloadHelper from '@pkg/mixins/weblogic-workload-helper';
import VerrazzanoWeblogic8Workload from './VerrazzanoWeblogic8Workload';
import VerrazzanoWeblogic9Workload from './VerrazzanoWeblogic9Workload';

const WKO_DOMAIN_8_VERSION = 'domain-v8';
const WKO_DOMAIN_9_VERSION = 'domain-v9';

export default {
  name:       'VerrazzanoWebLogicWorkload',
  components: { VerrazzanoWeblogic8Workload, VerrazzanoWeblogic9Workload },
  mixins:     [WeblogicWorkloadHelper],
  props:      {
    value: {
      type:     Object,
      required: true
    },
    mode: {
      type:    String,
      default: 'create'
    },
  },
  data() {
    return {
      configRoot: this.value,
      namespace:  '',
    };
  },
  computed: {
    isModelInImage() {
      return this.getWorkloadSpecField('domainHomeSourceType') === 'FromModel';
    },
    isV8Domain() {
      return this.getWorkloadMetadataField('labels')?.['weblogic.resourceVersion'] === WKO_DOMAIN_8_VERSION;
    },
    isV9Domain() {
      return this.getWorkloadMetadataField('labels')?.['weblogic.resourceVersion'] === WKO_DOMAIN_9_VERSION;
    },
  },
  methods:  {
    initSpec() {
      this.$set(this.configRoot, 'spec', {
        workload: {
          apiVersion: this.verrazzanoWeblogicDomainApiVersion,
          kind:       'VerrazzanoWebLogicWorkload',
          spec:       {
            template: {
              metadata: { labels: { 'weblogic.resourceVersion': WKO_DOMAIN_9_VERSION } },
              spec:     { }
            }
          }
        }
      });
    },
  },
  created() {
    if (!this.configRoot.spec?.workload?.spec?.template) {
      this.initSpec();
    }
  },
};
</script>

<template>
  <div>
    <VerrazzanoWeblogic8Workload v-if="isV8Domain" :value="value" :mode="mode" :is-model-in-image="isModelInImage" />
    <VerrazzanoWeblogic9Workload v-else :value="value" :mode="mode" :is-model-in-image="isModelInImage" />
  </div>
</template>

<style scoped>
</style>
