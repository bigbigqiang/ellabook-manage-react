# 具体使用

EllaUploader如果不在表单Form中使用，请使用initialValue来设置初始值。
如果在表单Form中使用，原则上会自动使用getFieldDecorator里的initialValue，但是会显示异常，因此，在组件中，请同样设置initialValue

```jsx
<FormItem className={styles.res_item}>
  {getFieldDecorator('itemList[0].resItem', {
    initialValue: _.get(data, 'itemList[0].resItem', ''),
    rules: [
      {
        required: true,
        message: '不可为空',
      }
    ],
  })(
    <EllaUploader
      initialValue={_.get(data, 'itemList[0].resItem', '')}
      label="题项资源"
    />
  )}
</FormItem>
```
