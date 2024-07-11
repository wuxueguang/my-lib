export default () => {


  return (
    <table style="page-break-inside: avoid;border-color: #d9d9d9;margin-top: 10px;" width="100%" border="1px">
      <tr style="height: 40px;background-color: #fafafa;">
        <td style="width: 200px;text-indent: 5px;">商品信息</td>
        <td style="width: 130px;text-indent: 5px;">含税单价（元）</td>
        <td style="width: 50px;text-indent: 5px;">税率</td>
        <td style="width: 80px;text-indent: 5px;">单价税额</td>
        {{each quoteDetailList}}
        {{if $index == 0}}
        {{if $value.purchaseCountStr}}
        <td style="width: 100px;text-indent: 5px;">采购数量</td>
        {{/if}}
        {{if $value.unitName}}
        <td style="width: 100px;text-indent: 5px;">采购数量单位</td>
        {{/if}}
        {{if $value.supplierName}}<td style="width: 100px;text-indent: 5px;">供货商</td>
        {{/if}}{{if $value.areaTitle}}<td style="text-indent: 5px;">区域</td>
        {{/if}}
        {{/if}}
        {{/each}}
        </tr>
        {{each quoteDetailList}}
        <tr style="min-height: 40px;">
          <td style="padding-left: 5px;">
            <p>【{{$value.goodsName}}】</p>
            <p>商品编码：【{{$value.goodsCode}}】</p>
            <p>类目：【{{$value.leafCategoryName}}】</p>
            <p>采购商备注：【{{$value.purchaserMemo}}】</p>
            <p>供应商备注：【{{$value.supplierMemo}}】</p>
          </td>
          <td style="padding-left: 5px;">
            {{$value.taxUnitPrice}}
          </td>
          <td style="padding-left: 5px;">
            {{$value.taxRatePercent}}
          </td>
          <td style="padding-left: 5px;">
            {{$value.taxAmount}}
          </td>
          {{if $value.purchaseCountStr}}
          <td style="padding-left: 5px;">
            {{$value.purchaseCountStr}}
          </td>
          {{/if}}
          {{if $value.unitName}}
          <td style="padding-left: 5px;">
            {{$value.unitName}}
          </td>
          {{/if}}
          {{if $value.supplierName}}
            <td style="padding-left: 5px;">
              {{$value.supplierName}}
            </td>
            {{/if}}
            {{if $value.areaTitle}}
            <td style="padding-left: 5px;">
              {{$value.areaTitle}}
            </td>
            {{/if}}
          </tr>
          {{/each}}
        </table>
  )


  <table style=\"page-break-inside: avoid;border-color: #d9d9d9;margin-top: 10px;\" width=\"100%\" border=\"1px\"><tr style=\"height: 40px;background-color: #fafafa;\"><td style=\"width: 200px;text-indent: 5px;\">商品信息</td><td style=\"width: 130px;text-indent: 5px;\">含税单价（元）</td><td style=\"width: 50px;text-indent: 5px;\">税率</td><td style=\"width: 80px;text-indent: 5px;\">单价税额</td>{{each quoteDetailList}}{{if $index == 0}}{{if $value.purchaseCountStr}}<td style=\"width: 100px;text-indent: 5px;\">采购数量</td>{{/if}}{{if $value.unitName}}<td style=\"width: 100px;text-indent: 5px;\">采购数量单位</td>{{/if}}{{if $value.supplierName}}<td style=\"width: 100px;text-indent: 5px;\">供货商</td>{{/if}}{{if $value.areaTitle}}<td style=\"text-indent: 5px;\">区域</td>{{/if}}{{/if}}{{/each}}</tr>{{each quoteDetailList}}<tr style=\"min-height: 40px;\"><td style=\"padding-left: 5px;\"><p>【{{$value.goodsName}}】</p><p>商品编码：【{{$value.goodsCode}}】</p><p>类目：【{{$value.leafCategoryName}}】</p><p>采购商备注：【{{$value.purchaserMemo}}】</p><p>供应商备注：【{{$value.supplierMemo}}】</p></td><td style=\"padding-left: 5px;\">{{$value.taxUnitPrice}}</td><td style=\"padding-left: 5px;\">{{$value.taxRatePercent}}</td><td style=\"padding-left: 5px;\">{{$value.taxAmount}}</td>{{if $value.purchaseCountStr}}<td style=\"padding-left: 5px;\">{{$value.purchaseCountStr}}</td>{{/if}}{{if $value.unitName}}<td style=\"padding-left: 5px;\">{{$value.unitName}}</td>{{/if}}{{if $value.supplierName}}<td style=\"padding-left: 5px;\">{{$value.supplierName}}</td>{{/if}}{{if $value.areaTitle}}<td style=\"padding-left: 5px;\">{{$value.areaTitle}}</td>{{/if}}</tr>{{/each}}</table>
}
