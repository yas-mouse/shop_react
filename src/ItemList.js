import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "100%",
  },
  cardContent: {
    flexGrow: 1,
  },
}));

const ItemList = () => {
  const classes = useStyles();
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
  const [products, setProducts] = useState({ data: [] });

  const buyClick = async (event) => {
    const priceId = event.currentTarget.dataset.priceId;
    const DOMAIN = window.location.href.replace(/[^/]*$/, "");

    try {
      const resSession = await axios.post(
        `${process.env.REACT_APP_STRIPE_SERVER_API}/createCheckoutSession`,
        {
          priceId: priceId,
          successUrl: `${DOMAIN}success`,
          cancelUrl: `${DOMAIN}cancel`,
        }
      );

      const sessionId = resSession.data.body.id;
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const resProducts = await axios.get(`${process.env.REACT_APP_STRIPE_SERVER_API}/products`);
        setProducts(resProducts.data);
      } catch (error) {
        setProducts({ data: [] });
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            商品一覧
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            商品一覧の説明
          </Typography>
        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="md">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {products.data.map((item) => (
            <Grid item key={item.id} xs={6} sm={4} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={item.images[0]}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                  </Typography>
                  <Typography>{item.description}</Typography>
                  <Typography gutterBottom variant="h6" component="h2">
                    ¥{item.price.unit_amount}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    data-price-id={item.price.id}
                    onClick={buyClick}
                  >
                    今すぐ購入
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};
export default ItemList;