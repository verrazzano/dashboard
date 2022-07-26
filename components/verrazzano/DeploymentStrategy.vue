<script>
// Added by Verrazzano
import { mapGetters } from 'vuex';
import LabeledSelect from '@/components/form/LabeledSelect.vue';
import InputWithSelect from '@/components/form/InputWithSelect.vue';
import NotSetPlaceholder from '@/mixins/verrazzano/not-set-placeholder';
import { get, set } from '@/utils/object';

const DEPLOYMENT_STRATEGY_TYPES = {
  Recreate: 'Recreate',
  Rolling:  'Rolling'
};

export default {
  components: { LabeledSelect, InputWithSelect },
  computed:   {

    deploymentStrategyTypeOptions() {
      return Object.values(DEPLOYMENT_STRATEGY_TYPES).map((v) => {
        return ({ label: this.$store.getters['i18n/withFallback'](`verrazzano.types.deploymentStrategyType."${ v }"`), value: v });
      });
    },
    ...mapGetters({ t: 'i18n/t' })
  },

  mixins: [NotSetPlaceholder],
  props:  {
    mode: {
      type:    String,
      default: 'create'
    },
    value: {
      type:     Object,
      required: true
    },
  },
  created() {
    this.DEPLOYMENT_STRATEGY_TYPES = DEPLOYMENT_STRATEGY_TYPES;
  },
  data() {
    // --

    const deploymentTemplate = this.value?.spec?.workload?.spec?.deploymentTemplate;
    const strategyObj = deploymentTemplate?.strategy;

    const strategy = strategyObj?.type;
    let maxSurge;
    let maxUnavailable;
    let surgeUnits = '%';
    let unavaiableUnits = '%';

    if (strategyObj?.rollingUpdate) {
      maxSurge = JSON.parse(JSON.stringify( strategyObj.rollingUpdate.maxSurge));
      maxUnavailable = JSON.parse(JSON.stringify(strategyObj.rollingUpdate.maxUnavailable));

      if ( typeof maxSurge === 'string' && maxSurge.includes('%')) {
        maxSurge = maxSurge.slice(0, maxSurge.indexOf('%'));
      } else {
        surgeUnits = 'Pods';
      }

      if ( typeof maxUnavailable === 'string' && maxUnavailable.includes('%')) {
        unavaiableUnits = '%';
        maxUnavailable = maxUnavailable.slice(0, maxUnavailable.indexOf('%'));
      } else {
        unavaiableUnits = 'Pods';
      }
    }
    // else if (strategy === 'RollingUpdate') {
    //   set(deploymentTemplate, 'strategy.type', strategy);
    //   set(deploymentTemplate, 'strategy.rollingUpdate', { maxSurge: maxSurge + surgeUnits, maxUnavailable: maxUnavailable + unavaiableUnits });
    // }

    return {
      surgeUnits,
      unavaiableUnits,
      strategy,
      maxSurge,
      maxUnavailable,
    };
  },
  methods: {
    update() {
      let { maxSurge, maxUnavailable } = this;

      if (!maxSurge) {
        maxSurge = '25';
        this.maxSurge = maxSurge;
      }
      if (!maxUnavailable) {
        maxUnavailable = '25';
        this.maxUnavailable = maxUnavailable;
      }

      if (this.surgeUnits === '%' && !maxSurge.includes('%')) {
        maxSurge = `${ maxSurge }%`;
      }
      if (this.unavaiableUnits === '%' && !maxUnavailable.includes('%')) {
        maxUnavailable = `${ maxUnavailable }%`;
      }

      let strategy;

      if (this.strategy !== 'Recreate') {
        strategy = {
          rollingUpdate: {
            maxSurge,
            maxUnavailable,
          },
          type: 'RollingUpdate'
        };
      } else {
        strategy = { type: this.strategy };
      }

      Object.assign(this.value.spec.workload.spec.deploymentTemplate, { strategy });
    },
    updateWithUnits({ selected:units, text:value }, target) {
      this[target] = `${ value }`;
      if (target === 'maxSurge') {
        this.surgeUnits = units;
      } else {
        this.unavaiableUnits = units;
      }

      this.update();
    },
    get,
    set,
  },
};
</script>
<template>
  <div>
    <div :style="{'align-items':'center'}" class="row mb-20">
      <div class="col span-6">
        <LabeledSelect
          v-model="strategy"
          :mode="mode"
          :label="t('verrazzano.components.deploymentStrategyType')"
          :options="deploymentStrategyTypeOptions"
          :multiple="false"
          :placeholder="getNotSetPlaceholder(value, 'strategy')"
          @input="update"
        />
      </div>
    </div>
    <template v-if="strategy !== DEPLOYMENT_STRATEGY_TYPES.Recreate">
      <div class="col span-6">
        <InputWithSelect
          :text-value="maxSurge"
          :select-before-text="false"
          :select-value="surgeUnits"
          :text-label="t('workload.upgrading.maxSurge.label')"
          :mode="mode"
          type="number"
          :options="['Pods', '%']"
          :placeholder="getNotSetPlaceholder(value, 'maxSurge')"
          @input="e=>updateWithUnits(e, 'maxSurge')"
        />
      </div>
      <div class="col span-6">
        <InputWithSelect
          :text-value="maxUnavailable"
          :select-before-text="false"
          :select-value="unavaiableUnits"
          :text-label="t('workload.upgrading.maxUnavailable.label')"
          :mode="mode"
          type="number"
          :options="['Pods', '%']"
          :placeholder="getNotSetPlaceholder(value, 'maxUnavailable')"
          @input="e=>updateWithUnits(e, 'maxUnavailable')"
        />
      </div>
    </template>
  </div>
</template>
