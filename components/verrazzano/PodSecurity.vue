<script>
// Added by Verrazzano
import RadioGroup from '@/components/form/RadioGroup';
import { mapGetters } from 'vuex';
import VerrazzanoHelper from '@/mixins/verrazzano/verrazzano-helper';
import NotSetPlaceholder from '~/mixins/verrazzano/not-set-placeholder';

export default {
  components: { RadioGroup },
  mixins:     [VerrazzanoHelper, NotSetPlaceholder],

  props: {
    value: {
      type:    Object,
      default: () => {
        return {};
      }
    },
    mode: {
      type:    String,
      default: 'view'
    }
  },

  data() {
    const { shareProcessNamespace, hostPID, hostIPC } = this.value;

    return {
      shareProcessNamespace,
      hostPID,
      hostIPC,
    };
  },

  computed: { ...mapGetters({ t: 'i18n/t' }) }
};
</script>

<template>
  <div>
    <div class="row">
      <div class="col span-6">
        <RadioGroup
          :value="getField('shareProcessNamespace')"
          name="shareProcessNamespace"
          :label="t('workload.container.security.shareProcessNamespace')"
          :labels="['No', 'Yes']"
          :options="[false, true]"
          :mode="mode"
          @input="setBooleanField('shareProcessNamespace', $event)"
        />
      </div>
    </div>

    <div class="spacer" />

    <div class="row">
      <div class="col span-6">
        <RadioGroup
          :value="getField('hostIPC')"
          name="hostIPC"
          :label="t('workload.container.security.hostIPC')"
          :labels="['No', 'Yes']"
          :options="[false, true]"
          :mode="mode"
          @input="setBooleanField('hostIPC', $event)"
        />
      </div>
      <div class="col span-6">
        <RadioGroup
          :value="getField('hostPID')"
          name="hostPID"
          :label="t('workload.container.security.hostPID')"
          :labels="['No', 'Yes']"
          :options="[false, true]"
          :mode="mode"
          @input="setBooleanField('hostPID', $event)"
        />
      </div>
    </div>
  </div>
</template>
