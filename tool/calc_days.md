+++
draft=true
+++


<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>



</body>
<script>
  var last = new Date('2019', '4', '9');
  var today = new Date();

  function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  }

  document.write(datediff(last, today));

</script>

</html>