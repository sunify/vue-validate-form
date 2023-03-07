import { mount } from '@vue/test-utils';

import ValidationForm from './ValidationForm';
import BaseErrors from './BaseErrors';
import { ON_FIELD_CHANGE } from '../../src/components/constants';

describe('ValidationErrors', () => {
  let wrapper;

  const createComponent = ({ props, listeners } = {}) => {
    wrapper = mount(ValidationForm, {
      propsData: props,
      listeners,
      attachTo: document.body
    });
  };

  it('should submitted without settings', async () => {
    createComponent({
      listeners: {
        submit(values, { setError }) {
          setError('common', 'invalid', 'custom');
        }
      }
    });

    expect(wrapper.findComponent(BaseErrors).exists()).toBe(false);

    await wrapper.find('button[type=submit]').trigger('click');

    expect(wrapper.findComponent(BaseErrors).props().errors).toEqual([
      {
        type: 'custom',
        message: 'invalid',
        resetBehaviour: ON_FIELD_CHANGE
      }
    ]);
  });
});
