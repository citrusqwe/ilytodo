import * as Yup from 'yup';

export const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Name should be at least 1 symbol')
    .max(120, 'Name cant be more then 120 symbols')
    .required('Name is required'),
  color: Yup.string().required('Required'),
});

export const TaskSchema = Yup.object().shape({
  text: Yup.string()
    .min(1, 'Text should be at least 1 symbol')
    .max(300, 'Text cant be more then 300 symbols')
    .required('Text is required'),
});
